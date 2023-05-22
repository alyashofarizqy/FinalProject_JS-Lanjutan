async function process_argv() {
    let { argv } = process;
    argv = argv.slice(2);
    const result = await studentActivitiesRegistration(argv);

    return result;
}

async function getStudentActivities() {
    const response = await fetch('http://localhost:3001/activities');
    const activities = await response.json(); //ubah response dari server dlm bentuk JSON menjadi JS Object
    
    // return activities;
    return activities.map(activity => { //mapping pada activities
        const { id, name, desc, days } = activity;
        return { id, name, desc, days };
    });
}

getStudentActivities();

async function studentActivitiesRegistration(data) {
  const method = data[0]; //ambil nilai data
  
  if (method === 'CREATE') {
    const name = data[1]; //ambil nilai nama
    const day = data[2]; //ambil nilai hari
    const student = await addStudent(name, day);
    return student;
  } else if (method === 'DELETE') {
    const id = data[1];
    const message = await deleteStudent(id);
    return { message: `Successfully deleted student data with id ${id}` };
  // } else {
  //   throw new Error('Invalid method');
  }
}

async function addStudent(name, day) {
      const studentActivities = await getStudentActivities();
      const activities = [];
      
      for (let i = 0; i < studentActivities.length; i++) { //memeriksa setiap aktivitas dalam variabel studentActivities
        const activity = studentActivities[i];
        //const activities = studentActivities.filter(e => e.days.includes(days))
        if (activity.days.includes(day)) { //setiap aktivitas memiliki 'days' yang mencakup 'day' 
          activities.push({                //maka 'name' dan 'desc' dari aktivitas tsb ditambahkan sbg objek ke dlm array activities
            name: activity.name,
            desc: activity.desc
          });
        }
      }
    
      const response = await fetch('http://localhost:3001/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          activities: activities
        })
      });
    
      const newStudent = await response.json();
      return newStudent;
}

// addStudent("Anshori Atmodiredjo", "Sunday");

async function deleteStudent(id) {
    const response = await fetch(`http://localhost:3001/students/${id}`, {
    method: 'DELETE',
    headers: {
          'Content-Type': 'application/json'
    }
  })
//   .then(response => response.json())
//   .then(data => {
//     console.log({
//       message: `Successfully deleted student data with id ${data.id}`,
//     });
//   })
//   .catch(error => console.log(error));
    const deleteStud = await response.json();
    return deleteStud;
    //return response.json()
}

// deleteStudent("2");

process_argv()
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = {
    studentActivitiesRegistration,
    getStudentActivities,
    addStudent,
    deleteStudent
};
