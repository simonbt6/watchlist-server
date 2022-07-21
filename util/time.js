module.exports = {
    now: () => {
        return moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    }
}