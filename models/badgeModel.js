const moment = require("moment");

class Badge {

    constructor(id, user_id, badge_name, description, awarded_date) {
        this.id = id;
        this.user_id = user_id;
        this.badge_name = badge_name;
        this.description = description;
        this.awarded_date = awarded_date;
    }


    static fromRow(row) {
        return new Badge(
            row.badge_id,
            row.user_id,
            row.badge_name,
            row.badge_description,
            moment(row.awarded_date).format("YYYY-MM-DD HH:mm:ss"),
        );
    }
}
module.exports = Badge;