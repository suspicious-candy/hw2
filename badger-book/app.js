function buildStudents(student) {

	// TODO This function is just a suggestion! I would suggest calling it after
	//      fetching the data or performing a search. It should populate the
	//      index.html with student data by using createElement and appendChild.

	const StudentList = document.getElementById("students");

		let FullName = student.name.first +" "+ student.name.last;
		let Major = student.major;
		let Credits = student.numCredits;
		let fromWiscosnin= student.fromWisconsin;

		let Interests=[];
		for (let interest of student.interests){
			Interests.push(interest);
		}

		let CreditString = student.name.first + " is taking " + Credits 
		if (fromWiscosnin){
			CreditString+=" is from Wisconsin."
		}else{
			CreditString+=" is not from Wisconsin."
		}

		let InterstString = "They have " + Interests.length + " interests including..."

		let students = document.createElement("div");
		students.className = "col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-3"; 

				let studentContainer = document.createElement("div");

						let studentName = document.createElement("h2");
							studentName.innerText=FullName;
						studentContainer.appendChild(studentName);

						let studentMajor = document.createElement("h5");
							studentMajor.innerText=Major;
						studentContainer.appendChild(studentMajor);

						let studentCreditString = document.createElement("p");
							studentCreditString.innerText=CreditString;
						studentContainer.appendChild(studentCreditString);

						let studentInterstString = document.createElement("p");
							studentInterstString.innerText=InterstString;
						studentContainer.appendChild(studentInterstString);

						let studentInterestList = document.createElement("ul");
						for(let interest of Interests){
							let ints = document.createElement("li");
								ints.className="interest-item";
								ints.innerText=interest;
							studentInterestList.appendChild(ints);
						}

						studentContainer.appendChild(studentInterestList);
						
				students.appendChild(studentContainer);
		
		StudentList.appendChild(students);
		
}

function handleSearch(e) {
	e?.preventDefault(); // You can ignore this; prevents the default form submission!

	const StudentList = document.getElementById("students");
	StudentList.innerHTML=""

	let SearchName = "";
	let SearchMajor="";
	let SearchInterest="";

	SearchName=document.getElementById("search-name").value.toLowerCase().trim();
	SearchMajor=document.getElementById("search-major").value.toLowerCase().trim();
	SearchInterest=document.getElementById("search-interest").value.toLowerCase().trim();

	fetch( "https://cs571api.cs.wisc.edu/rest/s25/hw2/students" , {
		headers:{
			"X-CS571-ID" : CS571.getBadgerId()
		}
	})

	.then(res=>res.json())

	.then(data=>{

		const FilteredData = data.filter(student => {
			let FullName = student.name.first.trim() + " " + student.name.last.trim();
			let major = student.major.trim();
			let inter = student.interests.map(interest => interest.trim());
		
			return FullName.toLowerCase().includes(SearchName) &&
				   major.toLowerCase().includes(SearchMajor) &&
				   (inter.length === 0 ? SearchInterest === "" : inter.some(interest => interest.toLowerCase().includes(SearchInterest)));
		});

		const StudentNum= FilteredData.length;
		const StudentNumData=document.getElementById("num-results");
		StudentNumData.innerText=StudentNum;

		for (let student of FilteredData){
			buildStudents(student);	
		}
		console.log(FilteredData);
		attachInterestClickEvents() 	
	})

	.catch(error => console.error(error))

}


function attachInterestClickEvents() {
		
	document.querySelectorAll(".interest-item").forEach((interestItemAnchorHTML) => {

		interestItemAnchorHTML.addEventListener("mouseover", (e) => {
			e.target.style.cursor = "pointer";
		});

		interestItemAnchorHTML.addEventListener("mouseout", (e) => {
			e.target.style.cursor = "default";
		});

		interestItemAnchorHTML.addEventListener("click", (e) => {
			const selectedText = e.target.innerText;
			// TODO update the search terms to search just for the
			//      selected interest, and re-run the search!

			document.getElementById("search-name").value="";
			document.getElementById("search-major").value="";
			document.getElementById("search-interest").value=selectedText.toLowerCase().trim();
			handleSearch();
		});
	});
}


document.getElementById("search-btn").addEventListener("click", handleSearch);


fetch( "https://cs571api.cs.wisc.edu/rest/s25/hw2/students" , {
		headers:{
			"X-CS571-ID" : CS571.getBadgerId()
		}
})
.then(res=>res.json())
.then(data=>{

	const StudentNum= data.length;
	const StudentNumData=document.getElementById("num-results");
	StudentNumData.innerText=StudentNum;

	for (let student of data){
		buildStudents(student);	
	}
	console.log(data);
	attachInterestClickEvents() 	
})
.catch(error => console.error(error))
