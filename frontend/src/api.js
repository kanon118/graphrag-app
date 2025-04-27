export async function login(username, password) {
    const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username, password })
    });
    return response.json();
}

export async function uploadDocument(file, token) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    });
    return response.json();
}

export async function askQuestion(query, token) {
    const response = await fetch(`http://localhost:8000/ask?query=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
}
