const perPage = 10;
let currentPage = 1;
let username = '';

function fetchRepositories() {
    const input = document.getElementById('username');
    username = input.value.trim();

    if (username === '') {
        alert('Please enter a valid username.');
        return;
    }

    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    const repositoriesElement = document.getElementById('repositories');
    repositoriesElement.innerHTML = ''; 

  
    const apiUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${currentPage}`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            loader.style.display = 'none';
            console.log('GitHub API Response:', data);

            if (Array.isArray(data)) {
                renderRepositories(data);
            } else if (data.message) {
                
                throw new Error(`GitHub API Error: ${data.message}`);
            } else {
                throw new Error('Unexpected response format');
            }
        })
        .catch(error => {
            loader.style.display = 'none';
            alert(`Error fetching repositories: ${error.message}`);
        });
}

function renderRepositories(repositories) {
    const repositoriesElement = document.getElementById('repositories');
    repositoriesElement.innerHTML = ''; // Clear previous results

    repositories.forEach(repository => {
        const repositoryElement = document.createElement('li');
        repositoryElement.className = 'list-group-item';
        repositoryElement.innerHTML = `
            <span>${repository.name}</span>
            <span>${repository.language}</span>
        `;
        repositoriesElement.appendChild(repositoryElement);
    });

    // Update current page
    document.getElementById('currentPage').innerText = currentPage;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchRepositories();
    }
}

function nextPage() {
    currentPage++;
    fetchRepositories();
}
