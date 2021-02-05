let user;

d3.csv("./test.csv")
    .then((data) => {
        a(data);
    })
    .catch((err) => {
        console.log(err);
    });
const transformeFuncktion = (elem, value, place, nameAttribute, result = true) => {
    elem.innerHTML = value

    if (!result) {
        elem.style.backgroundColor = 'red';
    }
    elem.setAttribute("data-label", `${nameAttribute}`);
    place.append(elem)

}

const a = (data) => {

    const arrWithID = addId(data)
    const table = document.querySelector("tbody");

    for (let i = 0; i < arrWithID.length; i++) {
        validateNamePhoneEmail(arrWithID[i].full_name, arrWithID[i].phone, arrWithID[i].email);

        const tr = document.createElement("tr");
        tr.setAttribute("data-tr", "myTR");
        const id = document.createElement("td");
        transformeFuncktion(id, arrWithID[i]['id'], tr, "ID")
        table.append(tr);
        for (const key in arrWithID[i]) {
            const trimElement = makeTrim(arrWithID[i][key]);

            const td = document.createElement("td");

            switch (key) {
                case "full_name":
                    transformeFuncktion(td, trimElement, tr, "NAME")
                    break;
                case "phone":
                    const resultPhone = validatePhone(trimElement);
                    transformeFuncktion(td, trimElement, tr, "PHONE", resultPhone)
                    break;
                case "email":
                    transformeFuncktion(td, trimElement, tr, "Email")
                    break;
                case "age":
                    const resultAge = validateAge(+trimElement);
                    transformeFuncktion(td, trimElement, tr, "AGE", resultAge)
                    break;
                case "experience":
                    const resultExperience = validateExperience(trimElement, arrWithID[i].age);
                    transformeFuncktion(td, trimElement, tr, "EXPERIENCE", resultExperience)
                    break;
                case "yearly_income":
                    const resultYearly = validateYearlyIncome(parseFloat(trimElement));
                    transformeFuncktion(td, trimElement, tr, "YEARLY")
                    break;
                case "has_children":
                    const resultHasChildren = validateHasChildren(trimElement);
                    transformeFuncktion(td, trimElement.toUpperCase(), tr, "CHILDREN", resultHasChildren)
                    break;
                case "license_states":
                    const resultLicenseStates = validateLicenseStates(trimElement);
                    transformeFuncktion(td, resultLicenseStates, tr, "STATES")
                    break;
                case "expiration_date":
                    const resultExpirationDate = validateExpirationDate(trimElement);
                    transformeFuncktion(td, trimElement, tr, "DATE", resultExpirationDate)
                    break;
                case "license_number":
                    const resultLicenseNumber = validateLicenseNumber(trimElement);
                    transformeFuncktion(td, trimElement, tr, "NUMBER", resultLicenseNumber)
                    break;
            }
        }

        choseData(arrWithID, table, i)
    }
};

const choseData = (data, table, z) => {
    for (let i = 0; i < data.length; i++) {

        for (let j = i + 1; j < data.length; j++) {
            let email1 = data[i].email.toLocaleLowerCase(),
                email2 = data[j].email.toLocaleLowerCase(),
                phone1 = data[i].phone,
                phone2 = data[j].phone

            if (email1 == email2 || phone1 == phone2) {


                let s = data[j]['id'],
                    d = data[i]['id'];



                const myTr = table.querySelectorAll('tr[data-tr="myTR"]');

                const td = document.createElement("td");
                td.setAttribute("data-label", "Duplicate");
                td.textContent = `${s}, ${d}`

                myTr[z].append(td);

            } else {
                null
            }
        }
    }
}

const addId = (arr) => {
    return arr.map((obj, index) => {
        return ({...obj, id: index + 1 });
    });
};

const makeTrim = (value) => {
    return String(value).trim();
}

const validatePhone = (phone) => {
    if (phone.length === 11 && phone.slice(0, 1) !== "+") {
        return true;
    } else if (phone.length === 12 && phone.slice(0, 1) === "+") {
        console.log(phone.slice(0, 1));
        return true;
    } else {
        return false
    }
}

const validateAge = (age) => {
    if (typeof age === "number" && age >= 21) {
        return true;
    } else {
        return false;
    }
}

const validateExperience = (exp, age) => {
    const minAge = 21;
    if (age >= minAge && minAge + exp <= age) {
        return true;
    } else {
        return false;
    }
}

const validateYearlyIncome = (yearlyIncome) => {
    return yearlyIncome.toFixed(2);
}

const validateLicenseStates = (licenseStates) => {
    const newFormat = licenseStates.split("|").join(", ");

    return newFormat;
}

const validateExpirationDate = (expirationDate) => {
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

const validateHasChildren = (hasChildren) => {
    if (hasChildren.toUpperCase() !== 'TRUE' && hasChildren.toUpperCase() !== 'FALSE') {
        return false;
    } else {
        return true;
    }
}

const validateLicenseNumber = (licenseNumber) => {
    if (licenseNumber.length > 6 || licenseNumber.length < 6) {
        return false;
    } else {
        return true;
    }
}

const validateNamePhoneEmail = (name, phone, email) => {
    if (name.length === 0 || phone.length === 0 || email.length === 0) {
        table.remove();
        alert("File format is not correct!");
    }
}