---
layout: post
title: Hack This Site&#58; Realistic 2
page-id: post
tags: [tutorial, ethical hacking]
---

I've been really into penetration testing recently, and for fun, I've been working my way through all of the missions on [Hack This Site](https://www.hackthissite.org/). I thought it would be helpful to write up in-depth walkthroughs for each of the basic and realistic missions for those that are stuck and looking for an explanation, rather than just the solution.

In this walkthrough, we're going to go over the second realistic mission.

## Prerequisites

- Basic HTML
- Basic SQL
- SQL Injection

## Walkthrough

This time, our goal is to access the administration page of this website. As stated in previous posts, it's always a good idea to do a scan of the HTML in order to see if you can find anything that's hidden or was accidentally left over during development. After scanning the HTML, you should notice at the bottom of the body tag there's a link that's been "hidden".

After navigating to that URL, you should be presented with a login form. This looks like our path into the administration page. Now for the more difficult part, trying to gain access to the administration page. You could try throwing in common username/password combos, but our way in is to simply use some SQL injection.

To make this easier to understand, let's see what an injectable SQL query would look like:

`query = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "';`

As you can see, the values stored in the username and password variables are being used in order to create the query. The way this statement is being created is a huge vulnerability and will allow a specially crafted value to completely bypass authentication. This is exactly what is going on with this login form. Now, all we have to do is pass along a specially crafted value for both the username and password that'll allow us to completely bypass the authentication. 

Our goal here is to get the query to not care about the values of the username/password and instead always return true. This is fairly simple to do. The first thing we want to do is close the opening single quote by passing a single quote in as our username and password. At this point, if we were to submit this form with the username and password both set to `'`, the query  would look like this:

`SELECT * FROM users WHERE username=''' AND password='''`

This wouldn't work, though it could provide you with a valuable error message depending on how the system is set up. In this case, it just tells us that the username/password is invalid. So let's add some more to our value. As stated earlier, we want the query to completely ignore the values of the username and password. This is where the OR operator comes in handy. We can use it to create a condition that always evaluates to true, such as `1=1`. So now our value becomes:

`' OR '1'='1`

or

`' OR 1='1`

When submitted, the query becomes:

`SELECT * FROM users WHERE username='' OR '1'='1' AND password='' OR '1'='1'`

When you submit this value in both the username and password fields, you'll bypass authentication and complete the mission.

In case you're confused as to why we can't just do `' OR 1=1`, this is because we will end up with a query like this:

`SELECT * FROM users WHERE username='' OR 1=1' AND password='' OR 1=1'`

As you can see, there is a lone `'`. This single quote needs to be closed, which is why we have to add a `'` before that second 1.