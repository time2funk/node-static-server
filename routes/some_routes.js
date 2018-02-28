
module.exports = function(app, db) {

	app.post('/api/', (req, res) => {
		res.send('Hello');
	});
};
