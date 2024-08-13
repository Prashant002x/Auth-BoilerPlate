const print = (req, res) => {
    // Example using fetch
// fetch('/api/v1/auth/signup', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ username: 'testuser', password: 'testpass' }),
// });

    res.json({
        message: "Thank You"
    });
};

export default print;
