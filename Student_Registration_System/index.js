let row = 1;
let latestIndex=0;
// Reference to the table body
const studentList = document.getElementById("student-list");
console.log(studentList);

function addDetails(event){
    // Reading values from Form
    const Name = document.getElementById("student-name").value;
    const id = document.getElementById("student-id").value;
    const email = document.getElementById("student-email").value;
    const contact = document.getElementById("student-contact").value;
    console.log(Name,id,email,contact); // To verify whether value is being taken or not
      
    if(!Name || !id || !email || !contact){
        alert("Please fill up all details");
        event.preventDefault();
        return;
    }
    else if(!validateEmail(email)){
        alert("Please enter a valid email");
        event.preventDefault();
        return;
    }
    else if(!validateContact(contact)){
        alert("Please enter a 10-digit Mobile number");
        event.preventDefault();
        return;
    }
    else if(!validateId(id)){
        alert("Please enter a 8-digit ID");
        event.preventDefault();
        return;
    }
    else{
        studentList.innerHTML += 
            `<tr class='dataRow'>
                <td>${row}</td>
                <td>${Name}</td>
                <td>${id}</td>
                <td>${email}</td>
                <td>${contact}</td>
                <td><button class='editRow'>Edit</button></td>
                <td><button class='deleteRow'>Delete</i></button></td>
            </tr>`;
        row++; 
        // console.log(studentList); // To verify the nesting of Element nodes
    
        saveData();
    
        document.getElementById("student-form").reset(); // Resets the form to blank once Submitted
    }
}

function onDeleteRow(event){
    if(!event.target.classList.contains('deleteRow')) // Targets the Clicked Row not on Delete button but elsewhere
    return; //Exits the function
    
    const buttonClicked = event.target;
    const answer = confirm("This entry will be erased. Do you want to proceed?");
    if(answer) // If true
    buttonClicked.closest('tr').remove(); // Finds the closest specified parent element and removes

    saveData(); // Rows updated after deletion
}

function onEditRow(event){
    if(!event.target.classList.contains('editRow')) // Targets the Clicked Row not on Edit button but elsewhere
        return;
    const buttonClicked = event.target;
    const row_to_Edit = buttonClicked.closest('tr'); //Targets the row having corresponding Edit button
    const cells_to_Edit = row_to_Edit.getElementsByTagName('td'); // Reference for all cells in the row
    
    // The following part populates the form with row values whose corresponding 'Edit' button is clicked. LHS refers to form input boxes. RHS refers to row clicked on the display table
    document.getElementById("student-name").value = cells_to_Edit[1].textContent; // the LHS points to Name input box
    document.getElementById("student-id").value = cells_to_Edit[2].textContent; // LHS points to ID box
    document.getElementById("student-email").value = cells_to_Edit[3].textContent; // LHS points to Email box
    document.getElementById("student-contact").value = cells_to_Edit[4].textContent; //LHS points to Contact box

    //Changing the 'Submit' button to 'Update' on clicking any of the 'Edit' buttons
    const updateButton = document.querySelector('button[type="submit"]'); //Specifically targets the 'Add profile' button
    updateButton.textContent = 'Update Profile';

    updateButton.removeEventListener('click',addDetails); // At this point we have to remove the previous add function associated with the same button

    updateButton.onclick = function(event){

        const id = document.getElementById("student-id").value;
        const email = document.getElementById("student-email").value;
        const contact = document.getElementById("student-contact").value;

        if(!validateEmail(email)){
            alert("Please enter a valid email");
            event.preventDefault();
            return;
        }
        else if(!validateContact(contact)){
            alert("Please enter a 10-digit Mobile number");
            event.preventDefault();
            return;
        }
        else if(!validateId(id)){
            alert("Please enter a 8-digit ID");
            event.preventDefault();
            return;
        }

        updateDetails(row_to_Edit);
        document.getElementById("student-form").reset();
    }
}

function updateDetails(row_to_Edit){
    const cells_to_Edit = row_to_Edit.getElementsByTagName('td');
    

    cells_to_Edit[1].textContent = document.getElementById("student-name").value;
    cells_to_Edit[2].textContent = document.getElementById("student-id").value;
    cells_to_Edit[3].textContent = document.getElementById("student-email").value;
    cells_to_Edit[4].textContent = document.getElementById("student-contact").value;

    // Resetting the Button to Original State 'Add Profile'
    const reUpdateButton = document.querySelector('button[type="submit"]');
    reUpdateButton.textContent = 'Add Profile';

    //Detaching the Updating function from the button and Reattaching the Add function
    reUpdateButton.removeEventListener('click',updateDetails);
    reUpdateButton.addEventListener('click',addDetails);

    saveData();
}

// Function to save data to Local Storage
function saveData(){
    const rows = document.querySelectorAll(".dataRow"); //The existing set of rows till now
    const studentList = []; //Array to contain each student's info as an object

    rows.forEach((row)=>{ // for each Row
        const cells = row.getElementsByTagName('td'); // The existing set of columns in a particular row
        const student = {
            Index: cells[0].textContent,
            Name: cells[1].textContent,
            ID: cells[2].textContent,            
            Email: cells[3].textContent,            
            Contact: cells[4].textContent,            
        };
        latestIndex = cells[0].textContent; // Records total entries made till time.
        studentList.push(student);
    });

    const entryStatus = document.getElementById("entryStatus");
    entryStatus.innerHTML = `<h4>Total entries since inception - <strong>${latestIndex}</strong> (including Deleted Records)</h4>`;
    
    localStorage.setItem('students',JSON.stringify(studentList));
    //The Local Storage has Student list as an Array of Objects
}

//Load Data from Storage on Start
function loadData(){
    const  studentArray = JSON.parse(localStorage.getItem('students')); //Retrieves the value i.e., the array of objects in a readable format

    if(studentArray){ // If Local Storage is not empty
        studentArray.forEach(student => {
            studentList.innerHTML += 
            `<tr class='dataRow'>
            <td>${student.Index}</td>
            <td>${student.Name}</td>
            <td>${student.ID}</td>
            <td>${student.Email}</td>
            <td>${student.Contact}</td>
            <td><button class='editRow'>Edit</button></td>
            <td><button class='deleteRow'>Delete</i></button></td>
        </tr>`;
        });
        row = studentArray.length+1; // Keeps the Entry Number updated.
    }
}

function validateEmail(email){
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

function validateContact(contact){
    const re = /^\d{10}$/;
    return re.test(contact);
}

function validateId(id){
    const re = /^\d{8}$/;
    return re.test(id);
}

// Add Details
const button = document.getElementById("button-area"); //Reference to 'Add Profile' Button
button.addEventListener("click",addDetails);

// Delete Details
const deleteEl = document.getElementById('dataTable');
deleteEl.addEventListener('click',onDeleteRow); 

// Edit Details
const editEl = document.getElementById('dataTable');
editEl.addEventListener("click",onEditRow);

// Populates the table from LocalStorage when a Browser/Tab is opened.
window.onload = loadData;



