let user;

d3.csv("./test.csv")
	.then((data) => {
		a(data);
	})
	.catch((err) => {
		console.log(err);
	});

const a = (user) => {
	const table = document.querySelector("tbody");

	for (let i = 0; i < user.length; i++) {
		validateNamePhoneEmail(user[i].full_name, user[i].phone, user[i].email);

		const tr = document.createElement("tr");
		tr.setAttribute("data-tr", "myTR");
		const id = document.createElement("td");
		id.setAttribute("data-label", "ID");

		id.innerHTML = i;
		tr.append(id);

		table.append(tr);
		for (const key in user[i]) {
			const trimElement = makeTrim(user[i][key]);

			const td = document.createElement("td");

			switch (key) {
				case "full_name":
					td.innerHTML = trimElement;
					td.setAttribute("data-label", "NAME");
					tr.append(td);
					break;
				case "phone":
					const resultPhone = validatePhone(trimElement);

					td.innerHTML = trimElement;

					if (!resultPhone) {
						td.style.backgroundColor = "red";
					}

					td.setAttribute("data-label", "PHONE");
					tr.append(td);
					break;
				case "email":
					td.innerHTML = trimElement;
					tr.append(td);
					td.setAttribute("data-label", "Email");


					break;
				case "age":
					const resultAge = validateAge(+trimElement);

					td.innerHTML = trimElement;

					if (!resultAge) {
						td.style.backgroundColor = "red";
					}

					td.setAttribute("data-label", "AGE");
					tr.append(td);
					break;
				case "experience":
					const resultExperience = validateExperience(trimElement, user[i].age);

					td.innerHTML = trimElement;

					if (!resultExperience) {
						td.style.backgroundColor = "red";
					}

					td.setAttribute("data-label", "EXPERIENCE");
					tr.append(td);
					break;
				case "yearly_income":
					const resultYearly = validateYearlyIncome(parseFloat(trimElement));

					td.innerHTML = resultYearly;

					td.setAttribute("data-label", "YEARLY");
					tr.append(td);
					break;
				case "has_children":
					const resultHasChildren = validateHasChildren(trimElement);

					td.innerHTML = user[i][key];

					if (!resultHasChildren) {
						td.style.backgroundColor = "red";
					}

					td.setAttribute("data-label", "CHILDREN");
					tr.append(td);
					break;
				case "license_states":
					const resultLicenseStates = validateLicenseStates(trimElement);

					td.innerHTML = resultLicenseStates;

					td.setAttribute("data-label", "STATES");
					tr.append(td);
					break;
				case "expiration_date":
					const resultExpirationDate = validateExpirationDate(trimElement);
					td.innerHTML = trimElement;

					if (!resultExpirationDate) {
						td.style.backgroundColor = "red";
					}

					td.setAttribute("data-label", "DATE");
					tr.append(td);
					break;
				case "license_number":
					const resultLicenseNumber = validateLicenseNumber(trimElement);
					td.innerHTML = trimElement;

					if (!resultLicenseNumber) {
						td.style.backgroundColor = "red";
					}

					td.setAttribute("data-label", "NUMBER");
					tr.append(td);
					break;
			}
		}

		const myTr = table.querySelectorAll('tr[data-tr="myTR"]');

		const td = document.createElement("td");
					td.setAttribute("data-label", "Duplicate");
		for (let k = i + 1; k < user.length; k++) {
			if (user[i].email == user[k].email) {
				td.textContent = k;
				myTr[i].children[3].style.backgroundColor = "red";
			}

			if (user[i].phone == user[k].phone) {
				td.textContent = k;
				myTr[i].children[2].style.backgroundColor = "red";
			}
		}

		myTr[i].append(td);
	}

	function makeTrim(value) {
		return String(value).trim();
	}

	function validatePhone(phone) {
		if (phone.length === 10) {
			return true;
		} else if (phone[0] === "1" && phone.length === 11) {
			return true;
		} else if (phone.length === 12 && phone.slice(0, 2) === "+1") {
			return true;
		} else {
			return false;
		}
	}

	function validateAge(age) {
		if (typeof age === "number" && age >= 21) {
			return true;
		} else {
			return false;
		}
	}

	function validateExperience(exp, age) {
		const minAge = 21;

		if (age >= minAge && minAge + exp <= age) {
			return true;
		} else {
			return false;
		}
	}

	function validateYearlyIncome(yearlyIncome) {
		return yearlyIncome.toFixed(2);
	}

	function validateLicenseStates(licenseStates) {
		const newFormat = licenseStates.split("|").join(", ");

		return newFormat;
	}

	function validateExpirationDate(expirationDate) {
		let today = new Date();

		const yyyy = String(today.getFullYear());
		const mm = String(today.getMonth());
		const dd = String(today.getDay());

		today = `${mm}-${dd}-${yyyy}`;

		const data = expirationDate;
		const myData = data.split("-").reverse().join("-");

		const firstPatern = /^\d{4}-\d{2}-\d{2}$/;
		const secondPatern = /^\d{2}-\d{2}-\d{4}$/;

		if (firstPatern.test(data) !== true && secondPatern.test(data) !== true) {
			return false;
		}
		const inputData = new Date(myData).toISOString().slice(0, 10);
		const currentData = new Date(today).toISOString().slice(0, 10);

		if (inputData < currentData) {
			return false;
		}

		return true;
	}

	function validateHasChildren(hasChildren) {
		if (typeof hasChildren !== "boolean") {
			return false;
		} else {
			return true;
		}
	}

	function validateLicenseNumber(licenseNumber) {
		if (licenseNumber.length > 6 || licenseNumber.length < 6) {
			return false;
		} else {
			return true;
		}
	}

	function validateNamePhoneEmail(name, phone, email) {
		if (name.length === 0 || phone.length === 0 || email.length === 0) {
			table.remove();

			alert("File format is not correct!");
		}
	}
};
