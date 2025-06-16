document.addEventListener('DOMContentLoaded', () => {


    const file_input = document.getElementById('file_input');
    const editor = document.getElementById('editor');

    file_input.addEventListener('change', (e) => {
        const file = e.target.files[0];

        if (file) {

            let reader = new FileReader();

            reader.onload = (e) => {
                editor.value = e.target.result;
            };

            reader.readAsText(file);
        }

    

    });

    document.getElementById('btn-analizar').addEventListener('click', function() {
    const contenido = document.getElementById('editor').value;

    fetch('http://localhost:3000/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body:  contenido 
    })
    .then(response => response.json())
    .then(data => {
        console.log("Tokens:", data.tokens);
        console.log("Errores:", data.errors);
        renderTablaTokens(data.tokens);
        renderTablaErrores(data.errors);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    function renderTablaTokens(tokens) {
    const tableBody = document.getElementById('tabla-tokens-body');
    tableBody.innerHTML = ''; // Limpiar

    tokens.forEach((token, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${token.row}</td>
            <td>${token.column}</td>
            <td>${token.lexeme}</td>
            <td>${token.typeTokenString}</td>
        `;
        tableBody.appendChild(row);
    });
    
    
    }

    });
    
    function renderTablaErrores(errors, index) {
    const tableBody = document.getElementById('tabla-errors-body');
    tableBody.innerHTML = ''; // Limpiar

    errors.forEach((error, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${error.row}</td>
            <td>${error.column}</td>
            <td>${error.lexeme}</td>
            <td>${error.typeTokenString}</td>
        `;
        tableBody.appendChild(row);
    });

    }
    
});

    document.getElementById('btn-ver-tecnico').addEventListener('click', () => {
    const visor = document.getElementById('visor-pdf');
    const iframe = document.getElementById('iframe-pdf');
    iframe.src = '/pdfs/MANUAL_TECNICO.pdf'; 
    visor.style.display = 'block';
});

    document.getElementById('btn-ver-usuario').addEventListener('click', () => {
    const visor = document.getElementById('visor-pdf');
    const iframe = document.getElementById('iframe-pdf');
    iframe.src = '/pdfs/MANUAL_USUARIO.pdf'; 
    visor.style.display = 'block';
});

    document.getElementById('btn-cerrar').addEventListener('click', () => {
    const visor = document.getElementById('visor-pdf');
    const iframe = document.getElementById('iframe-pdf');
    iframe.src = '../Manuales/ManualDeUsuario_LFP_Practica1.pdf '; 
    visor.style.display = 'none';
    document.getElementById('pdfFrame').src = '';
});
