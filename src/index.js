import './style.css';
import html2pdf from 'html2pdf.js';


// On page load
document.addEventListener("DOMContentLoaded", () => {
    // "Generate Labels" BUTTON
    document.getElementById('generateLabels').addEventListener('click', fetchData);
    // Radio CSS change
    document.getElementById('listRadioContainer').addEventListener('change', handleRadioChange);
    document.getElementById('separatorRadioContainer').addEventListener('change', handleRadioChange);
    // Change button state when input changes
    document.getElementById('writeList').addEventListener('input', changeButtonState);
    document.getElementById('uploadList').addEventListener('input', changeButtonState);
});


function handleRadioChange(event) {
    // Input fields
    const writeDiv = document.getElementById('writeDiv');
    const uploadDiv = document.getElementById('uploadDiv');

    // List supply
    const writeRadioDiv = document.getElementById('writeRadioDiv');
    const uploadRadioDiv = document.getElementById('uploadRadioDiv');

    // Separator select
    const newlineRadioDiv = document.getElementById('newlineRadioDiv');
    const commaRadioDiv = document.getElementById('commaRadioDiv');

    const eventTargetName = event.target.getAttribute('name');

    if (eventTargetName === 'list-option') {
        if (event.target.value === 'upload') {
            uploadDiv.hidden = false;
            uploadRadioDiv.classList.remove('border-gray-300');
            uploadRadioDiv.classList.add('border-blue-600', 'bg-gray-200');

            writeDiv.hidden = true;
            writeRadioDiv.classList.remove('border-blue-600', 'bg-gray-200');
            writeRadioDiv.classList.add('border-gray-300');
        } else {
            writeDiv.hidden = false;
            writeRadioDiv.classList.remove('border-gray-300');
            writeRadioDiv.classList.add('border-blue-600', 'bg-gray-200');

            uploadDiv.hidden = true;
            uploadRadioDiv.classList.remove('border-blue-600', 'bg-gray-200');
            uploadRadioDiv.classList.add('border-gray-300');
        }
    } else if (eventTargetName === 'separator-option') {
        if (event.target.value === 'newline') {
            newlineRadioDiv.classList.remove('border-gray-300');
            newlineRadioDiv.classList.add('border-blue-600', 'bg-gray-200');

            commaRadioDiv.classList.remove('border-blue-600', 'bg-gray-200');
            commaRadioDiv.classList.add('border-gray-300');

            document.getElementById('writeList').setAttribute('placeholder', 'TPM - Trichocereus peruvianus Monstrose\n' + 'TPQC - Trichocereus peruvianus Quasi Cristata');
        } else {
            commaRadioDiv.classList.remove('border-gray-300');
            commaRadioDiv.classList.add('border-blue-600', 'bg-gray-200');

            newlineRadioDiv.classList.remove('border-blue-600', 'bg-gray-200');
            newlineRadioDiv.classList.add('border-gray-300');

            document.getElementById('writeList').setAttribute('placeholder', 'TPM - Trichocereus peruvianus Monstrose, TPQC - Trichocereus peruvianus Quasi Cristata');
        }
    }
}


function changeButtonState() {
    const writeInput = document.getElementById('writeList');
    const fileInput = document.getElementById('uploadList');
    const button = document.getElementById('generateLabels');

    if (writeInput.value.trim() !== '' || fileInput.files.length !== 0) {
        button.classList.remove('cursor-not-allowed', 'bg-blue-400');
        button.classList.add('cursor-pointer', 'bg-blue-600');
        button.disabled = false;
    } else {
        button.classList.remove('cursor-pointer', 'bg-blue-600');
        button.classList.add('cursor-not-allowed', 'bg-blue-400');
        button.disabled = true;
    }
}


function unhideDownloadButton() {
    const downloadButton = document.getElementById('downloadLabels');
    downloadButton.classList.remove('hidden');
    downloadButton.addEventListener('click', generatePDF);
}


function fetchData() {
    // Determine the source of data based on the selected radio button
    const writeRadio = document.getElementById('writeRadio');
    const uploadRadio = document.getElementById('uploadRadio');

    let inputData = '';
    if (writeRadio.checked) {
        // Use data from the textarea
        const textarea = document.getElementById('writeList');
        inputData = textarea.value;
        generateLabelsHTML(inputData);
    } else if (uploadRadio.checked) {
        // Use data from the file input (you may need to handle file input differently)
        const fileInput = document.getElementById('uploadList');
        // Assuming you want to read the file content once a file is selected

        if (fileInput.files.length > 0) {
            const selectedFile = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = function(event) {
                inputData = event.target.result;
                generateLabelsHTML(inputData);
            };
            reader.readAsText(selectedFile);

        }
    }
}


function generateLabelsHTML(inputData) {
    const separator = document.querySelector('input[name="separator-option"]:checked').value === 'newline' ? '\n' : ',';
    const nameList = inputData.split(separator);
    const labelContainer = document.getElementById('labelContainer');
    labelContainer.innerHTML = '';

    nameList.forEach((name) => {
        const trimmedName = name.trim(); // Remove leading/trailing whitespace
        if (trimmedName) {
            const parts = trimmedName.split('-').map(part => part.trim());
            if (parts.length > 0) {
                const label = document.createElement('div');
                label.className = 'label border p-4 rounded-lg text-center text-black';
                let maxWidthFactor = 6; // Initial max width factor
                label.style.height = 'fit-content'; // Set height to fit content

                // Loop to adjust maxWidth until DESCRIPTION fits within two rows
                while (maxWidthFactor <= 10) { // Adjust the limit as needed
                    label.style.maxWidth = `${maxWidthFactor * parts[0].length}ch`;
                    label.innerHTML = `<span class="font-bold">${parts[0]}</span><br>${parts.slice(1).join('<br>')}`;

                    // Check if the label exceeds two rows
                    if (label.scrollHeight > 2 * label.clientHeight) {
                        maxWidthFactor++; // Increase max width factor
                    } else {
                        break; // If it fits within two rows, exit the loop
                    }
                }

                labelContainer.appendChild(label);
            }
        }
    });

    unhideDownloadButton();
}




function generatePDF() {
    let element = document.getElementById('labelContainer');
    // Generate a dynamic filename with today's date
    let currentDate = new Date();
    let formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, '');
    let filename = `Labels-${formattedDate.substr(0, 4)}-${formattedDate.substr(4, 2)}-${formattedDate.substr(6)}.pdf`;

    let options = {
        margin: 0.1,
        filename: filename, // Use the dynamic filename
        image: {
            type: 'jpeg',
            quality: 0.98
        },
        html2canvas: {
            scale: 2
        },
        jsPDF: {
            unit: 'in',
            format: 'a4',
            orientation: 'portrait'
        }
    };

    // Generate the PDF and save it
    html2pdf().set(options).from(element).save()
        .then(function(pdfData) {
            console.log('PDF generation successful:', pdfData);
        })
        .catch(function(error) {
            console.error('PDF generation error:', error);
        });
}
