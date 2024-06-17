# Vecomp Solid Chat

This application is based on [use-chat](https://github.com/chatscope/use-chat) (which in turn is based on [CRA](https://create-react-app.dev/)) and the React chat components library [https://github.com/chatscope/chat-ui-kit-react](https://github.com/chatscope/chat-ui-kit-react) by [https://chatscope.io](https://chatscope.io).

# Usage
Clone the repository:

```console
$ git clone https://github.com/RalphBln/vecomp-solid-chat.git
```

CD into the project directory:

```console
$ cd vecomp-solid-chat
```

Create a `.env` file by copying the template:

```console
$ cp .env.example .env
```

Adjust the contents of `.env` to fit your environment.

Make sure the docker image of the Prova legal and ethical checker is present in your docker environment.

Run the application:

```console
$ docker-compose up -d
```
