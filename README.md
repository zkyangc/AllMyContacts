# All My Contacts

A simple web app to import and manage your contacts using vCard. 

## Tech Stack

* Node.js
* React.js
* SQLite3

## Demo

The demo of this app is deployed on Amazon EC2 and is aacessible with [this link](http://allmycontacts.duckdns.org:3000/).

## Deployment

The `Dockerfile` is provided and the image is posted on [Docker Hub](https://hub.docker.com/repository/docker/zkyang96/allmycontacts/tags?page=1&ordering=last_updated).

```bash
docker run -d -p 3000:3000 --name allmycontacts -e DANGEROUSLY_DISABLE_HOST_CHECK=true --restart=always zkyang96/allmycontacts:latest
```

## Sample vCard Data

`Sample vCards data can be found [here](https://docs.fileformat.com/email/vcf/). Only v4.0 is tested.

### Security

Please avoid uploading any personal data as there is no authentication implemented yet and, thus contacts information is accessible by anyone. Additionally, SSL is not yet implemented, so it's not secure from ISPs either.
