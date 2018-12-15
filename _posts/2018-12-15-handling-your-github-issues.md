---
layout: post
title: Handling Your GitHub Issues
page-id: post
tags: [open source]
---

I created and continue to maintain an [open source project](https://github.com/Erigitic/TotalEconomy) over on GitHub. With a few thousand people using the project, the backlog of issues naturally increases over time in the form of feature requests and, of course, bugs. I've been on a long hiatus from working on it to focus on other projects, but recently I've had a desire to get back to it and tackle this list of issues. Now, a problem that I've always had with this backlog of issues was trying to figure out where to start to make the process of navigating through it as simple and efficient as possible. As well as that, seeing pages of things to fix and add is quite intimidating. I thought I'd share the process I took, and am currently taking, in order to work towards the elusive issue count of 0 and make it easier.

## Issue Housekeeping

Before working on the issues, I found it to be beneficial to do some housekeeping to get them all organized.

### Label Issues

I've neglected to use labels, even though they are such a simple thing to use. Despite their simplicity, they do such a good job at organizing the issues and giving you some insight into them. Without even opening one, you can tell if it's a bug, feature request, high priority, etc. Now I will occasionally add labels to issues, but only sometimes. Here's the state of some of my issues before labeling them all:

![Before Labels]({{ site.url }}/assets/img/blog/before-labels.png)

As you can see, I didn't use labels all that much. So the first thing I set out to do was add the appropriate labels to every single issue. While I was at it, I closed any duplicate/similar issues and stated the duplicate issue number before closing it. The reasoning behind this is because it provides future reference as to why the issue was closed and where to continue the discussion if needed. This is something that I like to do and highly recommend doing. I had about three pages of issues to go through and label and close if a duplicate. After all of that, I'm now greeted with a beautiful list of labeled issues:

![After Labels]({{ site.url }}/assets/img/blog/after-labels.png)

Best of all, these issues can now be filtered by their labels. This proves very useful when you want to grab a list of all the bugs that need to be fixed. Again, labels are such a simple thing, but they are incredibly powerful when used and shouldn't be neglected as I've done for so long.

### Use GitHub Projects

Since I'm hosting my repository on GitHub, I'm able to use their built-in project boards. An alternative to GitHub projects is [Trello](https://trello.com), another fantastic tool for keeping track of tasks. As I brought up earlier, the list of issues can be intimidating and you may not know where to begin with them. GitHub projects help turn that long list of issues into much smaller sections so you can organize them even more. They also gives you a better idea of the path you want to take when it comes to working on the issues.

![Projects]({{ site.url }}/assets/img/blog/projects.png)

I used the project boards for keeping track of new features and feature reworks. Each feature got their own project board, and each one of these boards contained issues relating to that feature. Bug related issues were never added to a board as they should be a priority and fixed before adding new features.

### Update Dependencies

Depending on your project, dependencies should be updated before adding new code to the project. This way you're working with the latest features they offer and it helps to prevent having to fix code later on. It's best to take care of the updates right away and work from there.

In the case of my project, I had to make sure I was working with the latest Sponge API and running the latest version of Sponge Forge. With new versions of dependencies comes the chance of code breaking. Therefore, you always want to run through the code to make sure nothing broke. From here, I feel confident enough to work on the list of issues without making more work for myself.

## Working on the Issues

When it comes to picking the issues I want to work on, I follow a specific order: bugs, code quality, features (new and reworks), then legacy support. This order makes the most sense to me and I'll explain way.

### Bug Fixes

These are the most important issues to fix right off the bat in my opinion. In most cases, it doesn't make sense to release new versions with the same bugs as the previous. As well as that, working on a buggy project tends to lead to a lot of frustration. I've been breaking my own rule with this project for quite some time. No more! Bugs are going to be fixed right away, before anything else. A bug-free project is better for everyone.

### Code Quality and Style

I'm a sucker for beautiful looking code, even though I'm a big offender when it comes to writing and releasing ugly code. So before adding in any new features, I feel that it's beneficial to clean up the existing codebase. This not only makes it easier for myself to work with, but also those contributing their own code to the project. I've added a [style guide](https://github.com/Erigitic/TotalEconomy/blob/develop/CONTRIBUTING.md) to my repository in order to make it a bit more clear as to how the code should look. I even took it one step further by implementing [checkstyle](https://checkstyle.org/) into the build process to enforce the style guide. This way, whenever a style issue is present, it will let you know during the build process.

### New Features and Reworks

After fixing those pesky bugs and making the code pretty, I now feel that it's safe to add new features and rework old ones. While adding new features, always keep your style guide in mind.

For this part, it's time to make use of the project boards. Pick a feature from the board and start working on each issue within it. I find it's best to start with the feature you least want to work on. This way you can get that feature out of the way as soon as possible and move on to something more exciting. Leaving the worst feature for last doesn't work out very well for me and usually leads to it never being implemented.

### Legacy Versions

With my project, some users require a version that works with old versions of Sponge. This is due in part to the fact that sometimes it's just not possible to fully update everything to a new version. This may not need to be said, but creating legacy versions of a project should be saved till last. In other words, saved until after releasing the primary version. By creating legacy versions before fixing bugs, or adding new features, you're just setting yourself up for more work later on down the road. In the end, the main release of your project is usually the most used. Therefore, it should take priority.

This is the path I'm taking and continue to take with this project and its issues. Hopefully, my experience with this will provide you with some help in reaching an issue count of 0 on your own project.