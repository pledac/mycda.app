
const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp(functions.config().firebase);

const path = require('path');
const EasyFit = require('easy-fit').default;
const fs = require('fs');
const os = require('os');


const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);


exports.processActivityFile = functions.storage.object().onFinalize((object) => {
      
  // this gets raised every time a file gets uploaded in storage
  const filePath = object.name;
  const fileName = path.basename(filePath);
  const fileBucket = object.bucket; 
  const activityId = fileName.split('.')[0];
  
  if (!fileName.endsWith('fit')) {
    console.log('A file was uploaded but it is not a valid .fit activity file.');
    return null;
  }

  console.log('A new .fit file was uploaded.')

  // get the file from storage, save it locally, read contents and parse it
  const bucket = admin.storage().bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);
  
  // here we go... 
  return bucket.file(filePath).download({destination: tempFilePath})
  .then(() => {
    console.log('Downloaded activity .fit file locally in ' + tempFilePath);
    // read file content
    return new Promise(((resolve, reject) => {
      fs.readFile(tempFilePath, (error, content) => {
        if (error) {
          reject(error);
        } else {
          resolve(content);
        }
      });
    }));
  })
  .then((content) => {
    // parse content using .fit parser
    return new Promise((resolve, reject) => {
      let easyFit = new EasyFit({
        force: true,
        speedUnit: 'km/h',
        lengthUnit: 'km',
        temperatureUnit: 'kelvin',
        elapsedRecordField: true,
        mode: 'cascade',
      });

      easyFit.parse(content, (error, data) => {
        if (error) {
          reject(error)
        } else {
          console.log('Succesfully parsed .fit activity file.');
          resolve(data);
        }
      });
    });
  })
  .then((data) => {
    // get the activity document which this file belongs to and attach it while setting status to 'Processed'
    var docRef = db.collection("activities").doc(activityId);

    return docRef.update({
      fit: JSON.stringify(data),
      status: 'Processed'
    });
  })
  .then(() => fs.unlinkSync(tempFilePath));
})

