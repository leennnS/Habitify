const moment = require("moment");

class Daily {

    constructor(id, user_id, task_name, completed, created_at, last_completed_date) {
        this.id = id;
        this.user_id = user_id;
        this.task_name = task_name;
        this.completed = completed;
        this.created_at = created_at;
        this.last_completed_date = last_completed_date;
    }

    static fromRow(row) {
        return new Daily(
            row.daily_id,
            row.user_id,
            row.task_name,
            row.completed,
            moment(row.last_completed_date).format("YYYY-MM-DD HH:mm:ss"),
            moment(row.created_at).format("YYYY-MM-DD HH:mm:ss"),
        );
    }
}
module.exports = Daily;