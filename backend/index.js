// Importing Packages
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const csv = require('csv-parser');

const app = express();
const PORT = process.env.port || 3000;

app.use(express.json());
app.use(cors());
app.options('*', cors());

const csvHeaders = ['name', 'email', 'age', 'mobile_no', 'city', 'pincode'];

const csvFilePath = 'user_details.csv';

 // Create CSV file if it is not present
function createCSVFile() {
    return new Promise((resolve, reject)=>{
        fs.access(csvFilePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.log(`CSV file '${csvFilePath}' does not exist in the current directory`);
                const writeStream = fs.createWriteStream(csvFilePath);
                writeStream.write(csvHeaders.join(',') + '\n');
                writeStream.end();
                console.log('CSV file created successfully');
                
            } else {
                console.log(`CSV file '${csvFilePath}' already exists in the current directory`);
                
            }
            resolve(true);
        });
    });
}


// Fetch all user details
function fetchAllUsers() {
    return new Promise((resolve) => {
        const results = [];
        fs.createReadStream(csvFilePath)
        .pipe(csv()).on('data', (data) => {
            results.push(data);
        }).on('end', () => {
            console.log('CSV file parsed successfully');
            resolve(results);
        });
    });
}

// update/delete the user details
function updateUserDetail(data) {
    return new Promise( (resolve) => {
        fetchAllUsers().then((results) => {
            if (!data.operation) {
                resolve({ status: 404, message : "Payload data is incorrect", results });
            }
            
            fs.readFile(csvFilePath, 'utf8', (err, response) => {
                if (err) {
                    resolve({
                        status: 404,
                        message: `CSV file is not present`,
                        results: []
                    });
                }
                
                const rows = response.split('\n');
                if (data.id > 0 && data.id <= rows.length) {
                    data.operation == "update"  ? rows[data.id] = data.updateData.join(',') 
                                        : rows.splice(data.id, 1);
                    const updatedContent = rows.join('\n');
                    fs.writeFile(csvFilePath, updatedContent, 'utf8', (err) => {
                        if (err) {
                            resolve({
                                status: 404,
                                message: data.operation == "update" ? `Failed to update user detail` 
                                                                    : `Failed to delete user detail`,
                                results
                            });
                        } else {
                            fetchAllUsers().then((results) => {
                                resolve({
                                    status: 200,
                                    message: data.operation == "update" ? `User detail has been updated successfully` 
                                                                        : `User detail has been deleted successfully`,
                                    results
                                });
                            });
                        }
                    });
                } else {
                    resolve({
                        status: 404,
                        message: `User id - ${data.id} is not present`,
                        results
                    });
                }
            });
        })
    });
}

// To fetch all users data from CSV file
app.get('/getAllUsers', (req, res) => {
    createCSVFile().then( (flag) => {
        if(flag) {
            fetchAllUsers().then((results) => {
                res.json({
                    status: 200,
                    message: `User details successsfully fetched`,
                    results
                });
            })
        } else {
            res.json({
                status: 404,
                message: `User details are not present`,
                results: []
            });
        }
    });
});

// To fetch searched users data from CSV file
app.get('/searchUserDetail', (req, res) => {
    const header = req.query.header; // Header to search
    const value = req.query.value; // Value to search
    const pattern = new RegExp(value, 'gi');
    const results = []; // Array to store the matching rows
    try {
        fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
        // Check if the value matches the specified header
            if (row[header].match(pattern)) {
                results.push(row);
            }
        })
        .on('end', () => {
            res.json({
                status: 200,
                message: results.length ? `Searched data is present` 
                                        : `Searched data is not present`,
                results
            });
        });
    } catch (err) {
        res.json({
            status: 404,
            message: `Can't able to perform search operation`,
            results
        });
    }
});


// create users data in the csv file
app.post('/createNewUser', (req, res) => {
    let data = req.body;
    try{
        createCSVFile().then( (flag) => {
            if(flag) {
                const writeStream = fs.createWriteStream(csvFilePath, { flags: 'a' });
                // Write the new data to the CSV file
                writeStream.write(data.newUser.join(',') + '\n');
                // Close the write stream
                writeStream.end();
                console.log('New user details inserted to CSV file successfully');
                fetchAllUsers().then((results) => {
                    res.json({
                        status: 200,
                        message: `User detail has been inserted successfully `,
                        results
                    });
                })
            } else {
                res.json({
                    status: 404,
                    message: `Failed to create new CSV file`,
                    results: []
                });
            }
        });        
    } catch (err) {
        console.error(`Can't able to insert new user detail in the CSV file`);
        res.json({
            status: 404,
            message: `Failed to insert new user detail in the CSV file`,
            results: []
        });
    }
});

// Update users data in the csv file
app.put('/updateExistingUserDetail/:id', (req, res) => {
    const data = req.body;
    data.id = req.params.id;
    data.operation = "update";
    updateUserDetail(data).then((results) => {
        res.json(results);
    });
});

// Delete exisiting user detail in the CSV file
app.delete('/deleteExistingUserDetail/:id', (req, res) => {
    const data = {
        "operation": "delete",
    };
    data.id = req.params.id;
    updateUserDetail(data).then((results) => {
        res.json(results);
    });
});

// Delete all exisiting user details in the CSV file
app.delete('/deleteAllUsers', (req, res) => {
    fs.unlink(csvFilePath, (err) => {
        if(!err) {
            res.json({
                status: 200,
                message: `Successfully deleted all users`,
                results: []
            });
        } else {
            fetchAllUsers().then((results) => {
                res.json({
                    status: 404,
                    message: `Failed to delete all users`,
                    results
                });
            })
        }
    });
});

app.listen(PORT, () => { console.log('Server is listening on port 3000'); });