const moment = require("moment");

class Friendship {

    constructor(id, user_id, friend_id, status, created_at, username, email, profile_picture) {
        this.id = id;
        this.user_id = user_id;
        this.friend_id = friend_id;
        this.status = status;
        this.created_at = created_at;
        this.username = username;
        this.email = email;
        this.profile_picture = profile_picture;

    }

    static fromRow(row) {
        return new Friendship(
            row.friendship_id,
            row.user_id,
            row.friend_id,
            row.status,
            moment(row.created_at).format("YYYY-MM-DD HH:mm:ss"),
            row.username,
            row.email,
            row.profile_picture,
        );
    }
}

module.exports = Friendship;