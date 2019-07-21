---
layout: post
title: 'OverTheWire Bandit Level 0 -> Level 1'
page-id: post
tags: [walkthrough, writeup]
---

> The password for the next level is stored in a file called readme located in the home directory. Use this password to log into bandit1 using SSH. Whenever you find a password for a level, use SSH (on port 2220) to log into that level and continue the game.

I highly recommend using a virtual machine or, even better, a Docker container running Linux when doing these challenges, and really any other CTFs like this. This helps to avoid messing anything up on your host machine. Though this is just a recommendation, not a requirement. If you're interested in using Docker for this, I created a [gist](https://gist.github.com/Erigitic/4b11297f02169a996c24f52729b58e01) with a Dockerfile and instructions on running it.

For all of the levels in Bandit, you'll need to know how to connect to a host through ssh. Here's the connection information for all the levels in Bandit:

```
Host: bandit.labs.overthewire.org
Port: 2220
```

Connecting to this host with ssh is very simple:

`ssh bandit.labs.overthewire.org -p 2220 -l bandit0`

We use `-p` to set the port number and `-l` to set the username. For this level, the username is `bandit0`. The username will always be in this format, with the 0 changing to 1, 2, 3, etc, depending on the level.

Once you execute this command, you may be presented with a message stating the authenticity of the host can't be established and a question asking `Are you sure you want to continue connecting (yes/no)?`, go ahead and type yes. You shouldn't have to do this every time. You'll then need to enter the password which they give you: `bandit0`. If everything was correct, you'll now be logged in and ready to start working on the level.

According to the level description, we have to look in the `readme` file for the next level's password. To make sure the file is actually within our current working directory, we can run `ls` to get a list of the files and directories. This will confirm that a `readme` file is indeed present. Now to print out the contents of that file we can make use of the cat command: `cat readme`. The password for the next level (Level 1) will be displayed and you can move on to the next level.

I highly recommend you keep a document of all of the passwords you find, just in case you ever need to go back to a previous level.

<!-- Next Level: [Bandit Level 1 -> Level 2]() -->
