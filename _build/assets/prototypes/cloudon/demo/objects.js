data = {
  "objects" : [
    // Type 1: Edit
    {
      "user":{
        "avatar": "img/avatar-person.png",
        "name":"Anthony Celestine"
      },
      "type": "edit",
      "target": {
        "file":"File 1",
        "url":"file url"
      },
      "time": "2013-07-07 12:00pm",
      "content": {
        "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vehicula eros quis odio imperdiet ac faucibus dolor mattis. Sed consequat fermentum urna, eget ultrices sapien cursus id. Mauris vel aliquet diam. Donec eu metus mauris. Quisque quis placerat libero. Aliquam erat volutpat. Pellentesque euismod turpis sit amet neque cursus adipiscing. Sed in libero sit amet tellus semper interdum. Duis purus tellus, auctor in pulvinar non, eleifend at odio. Nunc rhoncus lacinia consequat.",
        "url":"page/section url"
      }
    },

    // Type 2: Comment
    {
      "user":{
       "avatar": "img/avatar-person.png",
        "name":"Beatrice Daniels"
      },
      "type": "comment",
      "target": {
        "file":"File 1",
        "url":"file url"
      },
      "time": "2013-07-07 12:00pm",
      "content": {
        "detail":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. ",
        "url":"page/section url"
      }
    },

    // Type 3: Share
    {
      "user":{
        "avatar": "img/avatar-person.png",
        "name":"Beatrice Daniels"
      },
      "type": "share",
      "target": {
        "file":"File 1",
        "url":"file url"
      },
      "time": "2013-07-07 12:00pm"
    },

    // Type 4: Unshare
    {
      "user":{
        "avatar": "img/avatar-person.png",
        "name":"Beatrice Daniels"
      },
      "type": "unshare",
      "target": {
        "file":"File 1",
        "url":"file url"
      },
      "time": "2013-07-07 12:00pm"
    },
  ]
}