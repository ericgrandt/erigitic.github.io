---
layout: post
title: Tackling Issues in Your Open Source Project
page-id: post
tags: [open source]
---

I created and continue to maintain an [open source project](https://github.com/Erigitic/TotalEconomy) over on GitHub. With a few thousand people using the project, the backlog of issues naturally increases over time in the form of feature requests and, of course, bugs. Now, a problem that I've always had with this backlog of issues was trying to figure out where to start to make the process of navigating through it as simple and efficient as possible. I thought I'd share the process I took, and am currently taking, in order to work towards the elusive issue count of 0.

## Issue Housekeeping

Before working on the issues, I find it beneficial to do some housekeeping to get them all organized. There are a few simple things you can do to accomplish this.

### Labels

I've neglected to use labels in a lot of my projects, even though they're such a simple thing to use. Despite their simplicity, they do such a great job at organizing the issues and giving you some insight into them. Without even opening one, you can tell if it's a bug, feature request, high priority, etc. So the first thing to do is add the appropriate labels to every single issue. Best of all, these issues can now be filtered by their labels. This proves very useful when you want to grab a list of all the bugs that need to be fixed. Again, labels are such a simple thing, but they are incredibly useful when it comes to organization and they shouldn't be neglected.

### Close Duplicate Issues

If you have an open source project, the chance of duplicate issues popping up is fairly likely. While you're going through labeling issues, you should also close any duplicate issues you find. After closing the duplicate issue, you should post a comment within it stating the duplicate issue number. The reasoning behind this is because it provides future reference as to why the issue was closed and where to continue the discussion if needed. This is something that I like to do and highly recommend doing.

### GitHub Projects

As I brought up earlier, the list of issues can be intimidating and you may not know where to begin with them. GitHub allows you to create project boards within a repository that help turn that long list of issues into much smaller sections, making them more manageable. If you're project isn't hosted on GitHub, or you're looking for an alternative, [Trello](https://trello.com) is also a great option. These boards help give you better idea idea of the path you want to take when it comes to working on the issues. In my projects, I use project boards for keeping track of new features and feature reworks. Each feature gets its own project board, and each one of these boards contains issues relating to that feature. Bug related issues are never added to a board as they should be a priority and fixed before adding any new features.

### Update Dependencies

Depending on your project, dependencies should be updated before adding new code. This way you're working with the latest features, and bug/security fixes they offer. It's best to take care of the updates right away and work from there. With new versions of dependencies comes the chance of your code breaking. Therefore, you always want to run through the code to make sure nothing broke. Again, this totally depends on your project and should only be done if appropriate. If all is good, I feel it's time to begin working on the issues at this point.

## Working on the Issues

When it comes to picking issues to work on, I follow a specific order: bugs, code quality, features (new and reworks), then legacy support. This order makes the most sense to me and has worked fairly well.

### Bug Fixes

These are the most important issues to fix right off the bat in my opinion. In most, if not all cases, it doesn't make sense to release new versions with the same bugs as the previous. As well as that, working on a buggy project tends to lead to a lot of frustration for everyone involved in pushing new code. A bug-free project is better for developers and users alike.

### Code Quality and Style

I'm a sucker for beautiful looking code, even though I'm a big offender when it comes to writing and releasing ugly code. So before adding in any new features, I feel that it's beneficial to clean up the existing codebase. This not only makes it easier for you to work with, but also those contributing to the project. To keep everyone in the loop, add a style guide to your project, usually in `CONTRIBUTING.md`. You can take this one step further by implementing a style check into your build process. Some examples are [Checkstyle](https://checkstyle.org/) for Java and [ESLint](https://eslint.org/) for JavaScript. This way, whenever a style issue is present, it will let you know as soon as possible, allowing you to avoid pushing code with inconsistent styling.

### New Features and Reworks

After fixing those pesky bugs and making the code look good, I like to add new features and rework old ones. For these issues, it's time to make use of the boards created earlier. Pick a feature from the board and start working on each issue within it. I find it's best to start with the feature you least want to work on, then go from there. This way you can get that feature out of the way as soon as possible and move on to something a bit more exciting. Leaving the worst feature for last usually doesn't work out very well and can lead to it never being implemented. While adding new features, always keep your style guide in mind.

### Legacy Versions

Lastly, depending on your project, legacy versions may be required. This may not need to be said, but creating legacy versions of a project should be saved till last. In other words, saved until after releasing the main version. By creating legacy versions before fixing bugs, or adding new features, you're just setting yourself up for more work later on down the road. In the end, the main release of your project is usually the most used. Therefore, it should take priority.

A large backlog of issues can be really intimidating, and you may not know where to begin tackling them. But thanks to tools and features offered by some version control software, working with your issue backlog can be exceptionally simple and help provide a clear path towards fixing them. I hope this process will provide you with some help in reaching an issue count of 0 on your own projects. Thanks for reading.