import './input.css';

import jsPDF from 'jspdf';
document.getElementById('generateLabels').addEventListener('click', function () {
    const writeListInput = document.getElementById('writeList').value;

    // Create a new jsPDF instance
    const pdf = new jsPDF();

    // Generate labels and add to the PDF
    generateLabelsToPDF(pdf, writeListInput);

    // Output the PDF as data URL and display it
    const pdfViewer = document.getElementById('pdfViewer');
    pdfViewer.innerHTML = '<iframe width="100%" height="400px" src="' + pdf.output('datauristring') + '"></iframe>';
});

function generateLabelsToPDF(pdf, labelList) {
    const labels = labelList.split(',');

    // Define spacing and rectangle radius
    const horizontalSpacing = 5; // Adjust as needed
    const verticalSpacing = 10; // Adjust as needed
    const rectangleRadius = 5; // Adjust as needed

    let currentX = horizontalSpacing;
    let currentY = verticalSpacing;

    for (const label of labels) {
        const parts = label.split('-').map(part => part.trim());
        if (parts.length >= 1) {
            const name = parts[0];
            const description = parts[1] || ''; // Ensure a description even if empty

            // Calculate label dimensions based on the text content
            const fontSize = 14;
            const nameWidth = pdf.getStringUnitWidth(name) * fontSize / 3.2;
            const descriptionWidth = pdf.getStringUnitWidth(description) * fontSize / 3.2;
            const labelWidth = Math.max(nameWidth, descriptionWidth) + 2 * horizontalSpacing;
            const labelHeight = 2 * verticalSpacing; // Set labelHeight here

            // Check if the label fits in the current row, otherwise move to the next row
            if (currentX + labelWidth > pdf.internal.pageSize.width - horizontalSpacing) {
                currentY += labelHeight + verticalSpacing * 0.5; // Adjust vertical spacing between rows
                currentX = horizontalSpacing;
            }

            // Draw a rounded rectangle
            pdf.roundedRect(currentX, currentY, labelWidth, labelHeight, rectangleRadius, rectangleRadius, 'D');

            // Calculate text positioning to center horizontally
            const nameX = currentX + (labelWidth - nameWidth) / 2;
            const descriptionX = currentX + (labelWidth - descriptionWidth) / 2;

            // Add NAME (bold)
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text(nameX, currentY + verticalSpacing / 1.3, name);

            // Add DESCRIPTION below NAME
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal'); // Reset font style to normal
            pdf.text(descriptionX, currentY + 1.5 * verticalSpacing, description);

            // Move to the next column
            currentX += labelWidth + horizontalSpacing;
        }
    }
}




// document.getElementById('generateLabels').addEventListener('click', function () {
//     const nameList = document.getElementById('writeList').value.split(',');
//     const labelContainer = document.getElementById('labelContainer');
//     labelContainer.innerHTML = '';
//
//     nameList.forEach(name => {
//         const parts = name.split('-').map(part => part.trim());
//         if (parts.length > 0) {
//             const label = document.createElement('div');
//             label.className = 'border border-black rounded-lg m-2 p-4 inline-block text-center align-middle text-black';
//             label.innerHTML = `<span class="font-bold">${parts[0]}</span><br>${parts.slice(1).join('<br>')}`;
//             labelContainer.appendChild(label);
//         }
//
//         document.getElementById('downloadLabels').classList.remove('hidden');
//     });
// });


function generateImage() {
    // This is a placeholder function; you should replace it with your image generation code.
    // Return the URL of the generated image.

}


document.addEventListener('DOMContentLoaded', function () {

    // LIST INPUT SELECT
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    const divContainers = document.querySelectorAll('.flex.items-center');

    function handleRadioChange(index) {
        divContainers.forEach((container) => {
            container.classList.remove('border-blue-600');
            container.classList.remove('bg-gray-200');
            container.classList.add('border-gray-300');
        });

        divContainers[index].classList.remove('border-gray-300');
        divContainers[index].classList.add('bg-gray-200');
        divContainers[index].classList.add('border-blue-600');

    }

    radioButtons.forEach((radio, index) => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                handleRadioChange(index);
                if (radio.value === 'upload') {
                    document.getElementById('uploadDiv').hidden = false
                    document.getElementById('writeDiv').hidden = true
                } else {
                    document.getElementById('writeDiv').hidden = false
                    document.getElementById('uploadDiv').hidden = true
                }
            }
        });
    });


    // "Generate Labels" BUTTON STATE
    const writeInput = document.getElementById('writeList');
    const fileInput = document.getElementById('uploadList');
    const button = document.getElementById('generateLabels');

    function changeButtonState() {
        if (writeInput.value.trim() !== '' || fileInput.files.length !== 0) {
            button.disabled = false
            button.classList.remove('cursor-not-allowed', 'bg-blue-400')
            button.classList.add('cursor-pointer', 'bg-blue-600')


        } else {
            button.disabled = true
            button.classList.remove('cursor-pointer', 'bg-blue-600')
            button.classList.add('cursor-not-allowed', 'bg-blue-400')
        }
    }

    writeInput.addEventListener('input', changeButtonState);
    fileInput.addEventListener('input', changeButtonState);
});

