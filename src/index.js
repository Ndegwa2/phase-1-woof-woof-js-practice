document.addEventListener('DOMContentLoaded', () => {
  // Fetch all dogs and display their names
  fetch('http://localhost:3000/pups')
    .then(response => response.json())
    .then(pups => {
      const dogBar = document.getElementById('dog-bar');
      pups.forEach(pup => {
        const span = document.createElement('span');
        span.textContent = pup.name;
        span.dataset.id = pup.id; // Store pup ID for later use
        dogBar.appendChild(span);
      });
    });

  // Add event listener to dog bar for showing pup details
  document.getElementById('dog-bar').addEventListener('click', event => {
    if (event.target.tagName === 'SPAN') {
      const pupId = event.target.dataset.id;
      fetch(`http://localhost:3000/pups/${pupId}`)
        .then(response => response.json())
        .then(pup => {
          const dogInfo = document.getElementById('dog-info');
          dogInfo.innerHTML = `
            <img src="${pup.image}" />
            <h2>${pup.name}</h2>
            <button>${pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
          `;
          dogInfo.querySelector('button').dataset.id = pup.id; // Store pup ID in button
        });
    }
  });

  // Add event listener to dog info for toggling pup status
  document.getElementById('dog-info').addEventListener('click', event => {
    if (event.target.tagName === 'BUTTON') {
      const button = event.target;
      const pupId = button.dataset.id;
      const isGoodDog = button.textContent === 'Good Dog!';
      
      fetch(`http://localhost:3000/pups/${pupId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isGoodDog: !isGoodDog })
      })
      .then(response => response.json())
      .then(updatedPup => {
        button.textContent = updatedPup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
      });
    }
  });

  // Add event listener to filter button
  let filterGoodDogs = false;
  document.getElementById('good-dog-filter').addEventListener('click', () => {
    filterGoodDogs = !filterGoodDogs;
    const button = document.getElementById('good-dog-filter');
    button.textContent = filterGoodDogs ? 'Filter good dogs: ON' : 'Filter good dogs: OFF';
    
    fetch('http://localhost:3000/pups')
      .then(response => response.json())
      .then(pups => {
        const dogBar = document.getElementById('dog-bar');
        dogBar.innerHTML = ''; // Clear the dog bar
        pups.filter(pup => !filterGoodDogs || pup.isGoodDog).forEach(pup => {
          const span = document.createElement('span');
          span.textContent = pup.name;
          span.dataset.id = pup.id;
          dogBar.appendChild(span);
        });
      });
  });
});
