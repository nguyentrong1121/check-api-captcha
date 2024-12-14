import React, {useEffect, useState} from "react";
import axios from "axios";

export default () => {
    const url = 'https://api.ton.place/',
        feed = 'feed',
        comment = 'posts/new'

    const [pagination, setPagination] = useState({
        "startFrom": 0,
        "section": "smart",
        "query": "",
        "page": 0,
        "feedUserId": 0
    });

    const [auth, setAuth] = useState('');

    useEffect(() => {
        if (pagination.page > 0) {
            callFeed()
        }
    }, [pagination.page])

    const callFeed = () => {
        axios.post(url + feed, pagination, {
            headers: {
                'Authorization': auth
            }
        }).then(({data}) => {
            callComment(data.nextFrom, data.feed)
        })
    }

    const callComment = (next, feed, i = 0) => {
        if (feed.length - 1 < i) {
            setPagination(prevState => ({
                ...prevState,
                page: prevState.page + 1,
                startFrom: Number(next)
            }))
            return
        }
        axios.post(url + comment, {
            "parentId": feed[i].id,
            "replyTo": 0,
            "text": "follow chéo nha, follow back 100%",
            "attachments": [],
            "groupId": 0
        }, {
            headers: {
                'Authorization': auth
            }
        }).then(() => {
            setTimeout(() => callComment(next, feed, i + 1), 2000)
        }).catch(() => {
            setTimeout(() => callComment(next, feed, i), 300000)
        })
    }

    return <div>
        <input value={auth} onChange={event => setAuth(event.target.value)}/>
        <button onClick={callFeed} style={{margin: 10}}><p>spam</p></button>
    </div>
}