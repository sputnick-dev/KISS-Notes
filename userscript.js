// ==UserScript==
// @name         KISS::Notes
// @namespace    https://sputnick.fr
// @version      1.6
// @description  Save notes per website in LocalStorage in a UserScript
// @author       sputnick
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function getStorageKey() {
        const url = window.location.pathname;
        const urlParams = new URLSearchParams(window.location.search);
        const queryString = urlParams.toString();
        return queryString ? `${url}?${queryString}` : url;
    }

    function displayNote() {
        const noteValue = localStorage.getItem(getStorageKey());

        // container for input text
        const sidebar = document.createElement('div');
        sidebar.className = 'note-sidebar';
        sidebar.style.position = 'fixed';
        sidebar.style.top = '30%'; // TOP position
        sidebar.style.right = '0';
        sidebar.style.zIndex = '9999';
        sidebar.style.backgroundColor = 'yellow';
        sidebar.style.padding = '5px';
        sidebar.style.fontSize = '16px'; // Police size
        sidebar.style.color = 'black';
        sidebar.style.textAlign = 'center';
        sidebar.style.width = '150px';
        sidebar.style.minHeight = '30px';
        sidebar.style.transition = 'width 0.3s';

        // Fold/unfold form
        const toggleButton = document.createElement('button');
        toggleButton.textContent = '▼';
        toggleButton.style.fontSize = '16px';
        toggleButton.style.marginBottom = '5px';
        toggleButton.onclick = () => {
            const inputContainer = document.getElementById('input-container');
            if (inputContainer.style.display === 'none') {
                inputContainer.style.display = 'block';
                sidebar.style.width = '150px';
                toggleButton.textContent = '▲';
            } else {
                inputContainer.style.display = 'none';
                sidebar.style.width = '30px';
                toggleButton.textContent = '▼';
            }
        };

        // Add fold button to container
        sidebar.appendChild(toggleButton);

        const inputContainer = document.createElement('div');
        inputContainer.id = 'input-container';
        inputContainer.style.display = noteValue ? 'block' : 'none';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Entrez votre note ici';
        input.style.fontSize = '16px';
        input.style.marginRight = '5px';

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Sauvegarder';
        saveButton.style.fontSize = '16px';

        // Handle Enter key press to send form
        saveButton.onclick = () => saveNote(input, sidebar);
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                saveNote(input, sidebar);
            }
        });

        inputContainer.appendChild(input);
        inputContainer.appendChild(saveButton);

        sidebar.appendChild(inputContainer);

        if (!noteValue) {
            inputContainer.style.display = 'none';
            sidebar.style.width = '30px';
        } else {
            sidebar.style.height = 'auto';
            sidebar.textContent = noteValue;
            const deleteButton = createDeleteButton(sidebar, inputContainer, toggleButton);
            sidebar.appendChild(deleteButton);
        }

        document.body.appendChild(sidebar);
    }

    // save note in LocalStorage
    function saveNote(input, sidebar) {
        const newNote = input.value.trim();
        if (newNote) {
            localStorage.setItem(getStorageKey(), newNote);
            sidebar.textContent = '';
            displayNote();
            input.value = '';
        } else {
            alert('Enter valid note.');
        }
    }

    // delete button
    function createDeleteButton(sidebar, inputContainer, toggleButton) {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '✖';
        deleteButton.style.fontSize = '16px';
        deleteButton.style.marginLeft = '5px';
        deleteButton.style.background = 'none';
        deleteButton.style.border = 'none';
        deleteButton.style.color = 'red';
        deleteButton.style.cursor = 'pointer';

        // event to delete note
        deleteButton.onclick = () => {
            localStorage.removeItem(getStorageKey());
            sidebar.textContent = '';
            inputContainer.style.display = 'block';
            toggleButton.textContent = '▼';
            sidebar.style.width = '150px';
            displayNote();
        };

        return deleteButton;
    }

    // wait Load event to execute the whole code
    window.onload = displayNote;
})();
