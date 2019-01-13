---
layout: post
title: Hack This Site&#58; Basic Missions
page-id: post
tags: [walkthrough, ethical hacking]
---

I've been really into penetration testing recently, and for fun, I've been working my way through all of the missions on [Hack This Site](https://www.hackthissite.org/). I thought it would be helpful to write up in-depth walkthroughs for each of the basic and realistic missions for those that are stuck and looking for an explanation, rather than just the solution.

In this first walkthrough, we're going to go over each of the basic missions in a single post as they're fairly straightforward.

## Basic 1

This mission doesn't require too much explanation. Looking through the source code should always be a priority when working your way through these missions, and hacking in general. The reasoning behind this is that sometimes a developer may leave a comment containing important information somewhere in the code by accident. For this one in particular, the developer seemed to do exactly that by leaving a comment containing the password.

## Basic 2

For this one, Network Security Sam removed the password from the source code and stored it in an unencrypted text file instead. The key thing to notice with this one is that "he neglected to upload the password file". Since he neglected to do this, what is the submitted password being compared to?

## Basic 3

Now the password file was uploaded, so you're going to have to figure out what the password is again. As stated above, looking through and understanding the source code is vital to passing these missions. If you inspect the source code, primarily that of the form, you should see a hidden input field that contains something very important. 

{:.spoiler}
The hidden field's value is `password.php`. Just navigate to that file to get the password.

## Basic 4

This time around, Sam ditched the password file. Instead, he created a password, that when forgotten, he can email it to himself by pressing a button. But he overlooked something very important: the email to send the password too can be changed very easily. Just like the other missions, looking through the source code will show you exactly where you can take advantage of this system.

{:.spoiler}
<div markdown="1">
Change Sam's email to your own email and press the button. You should get an email containing the password.

NOTE: You need to use the email address associated with your Hack This Site account. Also, from my experience, if you've completed this mission already, you will not receive an email.
</div>

## Basic 5

This mission can be completed in the exact same way as Basic 4.

## Basic 6

I love this mission! It requires a bit more work than the previous ones and a bit more thought. You'll notice you have the encrypted password given to you, which obviously needs to be decrypted to pass the mission. As well as that, you are given a form that allows you to encrypt your own values using the same encryption method used on the password. With that form and enough test inputs, you can figure out exactly how the encryption process works. Let's test a few:

{:.simple-table}
| Input | Output |
|-------|--------|
| ab    | ac     |
| 0     | 0      |
| 00    | 01     |
| 000   | 012    |
| 012   | 024    |
| 0125  | 0248   |

Hopefully, the table above and your own tests give you a decent idea as to what's going on. If not, click the "View Explanation" button below for a more in-depth explanation.

<button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#spoilerCollapse" aria-expanded="false" aria-controls="collapseExample">
	View Explanation
</button>
<div class="collapse" id="spoilerCollapse">
<div class="card card-body" markdown="1">
Each unencrypted character, converted to their ASCII equivalent, is incremented depending on their position. The first character is incremented by zero, the second character incremented by 1, the third character by 2, and so forth. Here's an [ASCII table](http://www.asciitable.com/) to show you the ASCII equivalent of each character. To decrypt the password, we just work backwards.

The encrypted password is `063d;;7;`. Converted to ASCII:

`48 54 51 100 59 59 55 59`

Now let's use the ASCII values above to decrypt the password:

`48 - 0 = 48 converted to character = 0`

`54 - 1 = 53 converted to character = 5`

`51 - 2 = 49 converted to character = 1`

`100 - 3 = 97 converted to character = a`

`59 - 4 = 55 converted to character = 7`

`59 - 5 = 54 converted to character = 6`

`55 - 6 = 49 converted to character = 1`

`59 - 7 = 52 converted to character = 4`
</div>
</div>

## Basic 7

This mission requires some basic knowledge of Unix. In particular, the `ls` command and how to execute multiple commands in one line.

Network Security Sam is still using an unencrypted password, but this time they're storing it in an obscurely named file within the current directory. We also have two forms, one that allows us to input a year which is then passed to the Unix `cal` command, and the usual password form. Since we know the value we type into the first input field is being passed to the Unix `cal` command, we should test to see if we can exploit that by passing in other commands along with it. To string together multiple commands, we can use a `;` to separate them. Knowing that, our next step is to figure out the command that will show us the contents of the current directory. 

{:.spoiler}
`; ls`

With the right input value, you should be sent to a page that will contain the contents of the current directory. One of the files listed stands out. You want to navigate to that file, and within it, you'll find the password

## Basic 8

In this mission, we are introduced to something called Server-Side Includes (SSI). SSI allows developers to generate content on pages through the use of SSI directives such as `<!--#echo var="HTTP_USER_AGENT" -->`. When done properly it can be a handy tool, but if not, can lead to an easy attack vector.

From the mission description, we know that Sam's daughter wrote a script that isn't very secure. Before exploiting this script, let's figure out what happens when submitting a form. When submitting a value in that first form, you're sent to a page with a link that takes you to a `.shtml` page. The `.shtml` file type tells you the page is being processed using SSI. As well as that, you'll notice that whatever you type into that first field is being displayed on the `.shtml` page. With all of that information, there's a good chance you can take advantage of the script by inputting your own SSI directives.

Let's test this out by inputting an SSI directive into the field:

`<!--#exec cmd="ls" -->`

If you view the generated `.shtml` page, you'll notice all the files within the current directory (`/tmp`) are displayed. That's good news for us as this shows our command was executed successfully. Now, to get the name of the password file, we have to modify the directive a bit to list the contents of the directory containing the password file. The mission description tells you where the password file is stored. The path they give you may look like it's tucked away somewhere far away from where you're currently at, but it's actually the base directory for mission 8. So to list the files in the base directory for mission 8, you need to move from `/tmp` to `/`. What can you use to go back a directory? If you're stuck, hover over the text below.

{:.spoiler}
<div markdown="1">
To go back a single directory use `..`
</div>

If you're still stuck, here's more of an explanation:

{:.spoiler}
<div markdown="1">
The location of the `.shtml` file is `.../8/tmp/*.shtml`. So in order to get to `.../8/`, you need to go back a single directory using `..`.

Here's the SSI directive to accomplish that:

`<!--#exec cmd="ls .." -->`
</div>

After successfully running the correct command, the page will display the files. One of those files stands out. To get the password, just navigate to that file.

## Basic 9

This mission is great at showing you that what you need isn't always on the same page you're trying to access. Sometimes you have to go to a different page to progress.

This one works in the exact same way as Basic 8. So much so that you need to go to back to Basic 8 and input another SSI directive that'll allow you to view the contents of `/var/www/hackthissite.org/html/missions/basic/9/`. It's just a matter of slightly modifying the directive used in the last mission. Hover over the text below if you're stuck:

{:.spoiler}
<div markdown="1">
Just like in Basic 8, you need to navigate out of `/tmp`. But instead of stopping there, you need to take it one step further and navigate out of `/8` and into `/9` to view that directories contents.

Here's the full directive:

`<!--#exec cmd="ls ../../9" -->`
</div>

## Basic 10

This mission only provides you with a password form. According to the mission description, a "hidden" approach was taken to authenticate the user. Not a ton of information is given on this one compared to the previous missions. Despite that, this mission is honestly one of the easiest.

Just like it's important to view the source code of a website when hacking, it's also important to take a look at the cookies being used as well. To view the cookies, you can use Javascript or the browsers application/storage inspector (Chrome/Firefox respectively). I recommend using the application/storage inspector as it's much easier, but it's important to know how to use Javascript as well.

### With Javascript

By running `document.cookie` from the console, the cookies will be shown. To set the value of a cookie using Javascript you use:

`document.cookie = "cookieName=value"`

### Application/Storage Inspector

This is the easiest way to do it in my opinion. If you've never used these tools before, here's some information on how to use them on Chrome and Firefox:

[View/Edit Cookies in Chrome](https://developers.google.com/web/tools/chrome-devtools/manage-data/cookies)

[View/Edit Cookies in Firefox](https://developer.mozilla.org/en-US/docs/Tools/Storage_Inspector)

Now that you know how to view and edit cookies, the rest should be straightforward. One of the cookies determines if you are authorized or not. The cookie that needs to be changed is:

{:.spoiler}
`level10_authorized`

Once you change the value of the cookie to the correct value, just press submit on the password form and you're in.

On a side note, I'd like to point out that the cookie being used isn't HttpOnly, meaning it can be changed using Javascript. This is a huge vulnerability considering this cookie determines whether someone is authorized or not. So if you ever work with cookies that shouldn't be changed using Javascript, such as session IDs, be sure to make them HttpOnly.

## Basic 11

From my experience, this mission is broken, but I'll still explain what's going on.

The key thing to take from the mission description is that Sam "does not understand Apache". An important thing to know about Apache, that relates to this mission, is that it utilizes a `.htaccess` file in order to configure a web server on a per-directory basis. This file is usually protected as it can contain some information that you don't want everyone knowing. Since Sam doesn't understand Apache, it's a good idea to see if you can access a `.htaccess` file as it may not be protected.

If you were to try and navigate to a `.htaccess` file from the current URL, it won't work. So you're going to have to look elsewhere. Let's take a look at the contents of the current page instead. The page displays a song title and everytime the page is refreshed it displays a different one. If you look these songs up, you should notice they all have something in common.

{:.spoiler}
They are all by Elton John

Knowing what they have in common, this mission is still quite difficult because it's not really clear as to what to do with that information. Something that helped me out was to think about how songs would be stored in a file system so they can easily be searched for and retrieved by the name of the artist. Try out a bunch of different things in the URL. If you're stuck:

{:.spoiler}
<div markdown="1">
The artist name, the one you figured out earlier, is split up character by character and added to the end of the URL:

`/e/l/t/o/n`
</div>

Once you type in the correct URL, you should reach an index page that doesn't contain any files. This would be a good place to try and access a `.htaccess` file again. Unfortunately, you can't access the file since it seems to be broken, at least for me. Still, give it a shot just in case. If you're able to access the file, you should see a line containing `IndexIgnore DaAnswer.* .htaccess`. This line tells the web server not to show `DaAnswer` or `.htaccess` in the auto-index response for this page. This is why no files show up on the index page. One of the ignored files that looks important is `DaAnswer`, so it's a good idea to see what's inside of it. Once you're inside the `DaAnswer` file, don't let the contents confuse you. It's simpler then you think.

{:.spoiler}
The file will contain something along the lines of `The answer is ...!`. It's telling you exactly what the answer is.

Now that you have the password, you just have to figure out where to use that password. This one requires some more guessing. Try accessing an `index.php` file from different directories.

{:.spoiler}
The URL you're looking for is `https://www.hackthissite.org/missions/basic/11/index.php`.

Once you find the page containing the password form, all you have to do is enter the password and submit it.