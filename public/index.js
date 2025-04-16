let dishes = [];
const apiUrl = "http://localhost:5000/api/dishes";

// DOM Elements
const dishesContainer = document.getElementById('dishes-container');

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

async function loadData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        dishes = result.data; // Access the data array from the response
        renderDishesTable();
    } catch (error) {
        console.error("Error loading data:", error);
        showError("Failed to load dishes. Please try again later.");
    }
}

function renderDishesTable() {
    // Clear previous content
    while (dishesContainer.firstChild) {
        dishesContainer.removeChild(dishesContainer.firstChild);
    }

    // Create and add the "Add Dish" button
    const addDishBtn = document.createElement('button');
    addDishBtn.id = 'add-dish-btn';
    addDishBtn.className = 'btn add-btn';
    addDishBtn.textContent = 'Add New Dish';
    addDishBtn.addEventListener('click', () => openModal('add'));
    dishesContainer.appendChild(addDishBtn);

    if (dishes.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'No dishes found.';
        dishesContainer.appendChild(message);
        return;
    }

    // Create table element
    const table = document.createElement('table');
    table.className = 'dishes-table';

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const headers = ['Name', 'Ingredients', 'Preparation Steps', 'Cooking Time', 'Origin', 'Difficulty', 'Actions'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    dishes.forEach(dish => {
        const row = document.createElement('tr');
        
        // Name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = dish.name;
        row.appendChild(nameCell);
        
        // Ingredients cell
        const ingredientsCell = document.createElement('td');
        ingredientsCell.textContent = dish.ingredients.join(', ');
        row.appendChild(ingredientsCell);
        
        // Preparation Steps cell
        const stepsCell = document.createElement('td');
        stepsCell.textContent = dish.preparationSteps.join('\n');
        row.appendChild(stepsCell);
        
        // Cooking Time cell
        const timeCell = document.createElement('td');
        timeCell.textContent = `${dish.cookingTime} minutes`;
        row.appendChild(timeCell);
        
        // Origin cell
        const originCell = document.createElement('td');
        originCell.textContent = dish.origin;
        row.appendChild(originCell);
        
        // Difficulty cell
        const difficultyCell = document.createElement('td');
        difficultyCell.textContent = dish.difficulty;
        row.appendChild(difficultyCell);
        
        // Actions cell
        const actionsCell = document.createElement('td');
        actionsCell.className = 'action-cell';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'btn edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => openModal('edit', dish));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteDish(dish._id));
        
        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
        row.appendChild(actionsCell);
        
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    dishesContainer.appendChild(table);

    // Create modal elements (dynamically)
    createModalElements();
}

// Rest of the code remains the same as before...
function createModalElements() {
    // Check if modal already exists
    if (document.getElementById('dish-modal')) return;

    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'dish-modal';
    modal.className = 'modal';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Create close button
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', closeModal);
    
    // Create modal title
    const modalTitle = document.createElement('h2');
    modalTitle.id = 'modal-title';
    modalTitle.textContent = 'Add New Dish';
    
    // Create form
    const form = document.createElement('form');
    form.id = 'dish-form';
    
    // Create hidden input for dish ID
    const dishIdInput = document.createElement('input');
    dishIdInput.type = 'hidden';
    dishIdInput.id = 'dish-id';
    
    // Create form fields based on your dish structure
    const fields = [
        { id: 'name', label: 'Name', type: 'text' },
        { id: 'ingredients', label: 'Ingredients (comma separated)', type: 'textarea' },
        { id: 'preparationSteps', label: 'Preparation Steps (one per line)', type: 'textarea' },
        { id: 'cookingTime', label: 'Cooking Time (minutes)', type: 'number' },
        { id: 'origin', label: 'Origin', type: 'text' },
        { id: 'difficulty', label: 'Difficulty', type: 'text' }
    ];
    
    fields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        
        const label = document.createElement('label');
        label.htmlFor = field.id;
        label.textContent = field.label + ':';
        
        let input;
        if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.id = field.id;
            input.required = true;
        } else {
            input = document.createElement('input');
            input.type = field.type;
            input.id = field.id;
            input.required = true;
        }
        
        formGroup.appendChild(label);
        formGroup.appendChild(input);
        form.appendChild(formGroup);
    });
    
    // Create submit button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn save-btn';
    submitBtn.textContent = 'Save';
    
    form.appendChild(submitBtn);
    form.appendChild(dishIdInput);
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleFormSubmit();
    });
    
    // Assemble modal
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(form);
    modal.appendChild(modalContent);
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function openModal(mode, dish = null) {
    const modal = document.getElementById('dish-modal');
    const modalTitle = document.getElementById('modal-title');
    const dishIdInput = document.getElementById('dish-id');
    
    if (mode === 'add') {
        modalTitle.textContent = 'Add New Dish';
        dishIdInput.value = '';
        document.getElementById('dish-form').reset();
    } else if (mode === 'edit' && dish) {
        modalTitle.textContent = 'Edit Dish';
        dishIdInput.value = dish._id;
        document.getElementById('name').value = dish.name;
        document.getElementById('ingredients').value = dish.ingredients.join(', ');
        document.getElementById('preparationSteps').value = dish.preparationSteps.join('\n');
        document.getElementById('cookingTime').value = dish.cookingTime;
        document.getElementById('origin').value = dish.origin;
        document.getElementById('difficulty').value = dish.difficulty;
    }
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('dish-modal').style.display = 'none';
}

async function handleFormSubmit() {
    const dishId = document.getElementById('dish-id').value;
    const isEditMode = !!dishId;
    
    const dishData = {
        name: document.getElementById('name').value,
        ingredients: document.getElementById('ingredients').value.split(',').map(item => item.trim()),
        preparationSteps: document.getElementById('preparationSteps').value.split('\n').map(step => step.trim()),
        cookingTime: parseInt(document.getElementById('cookingTime').value),
        origin: document.getElementById('origin').value,
        difficulty: document.getElementById('difficulty').value
    };

    try {
        let response;
        if (isEditMode) {
            response = await fetch(`${apiUrl}/${dishId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dishData)
            });
        } else {
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dishData)
            });
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        closeModal();
        await loadData(); // Refresh the table
    } catch (error) {
        console.error('Error saving dish:', error);
        showError('Failed to save dish. Please try again.');
    }
}

async function deleteDish(id) {
    if (!confirm('Are you sure you want to delete this dish?')) {
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        await loadData(); // Refresh the table
    } catch (error) {
        console.error('Error deleting dish:', error);
        showError('Failed to delete dish. Please try again.');
    }
}

function showError(message) {
    const errorElement = document.createElement('p');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    dishesContainer.innerHTML = '';
    dishesContainer.appendChild(errorElement);
}