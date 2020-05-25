---
layout: post
title: Hack This Site&#58; Realistic 1
page-id: post
tags: [tutorial, ethical hacking]
---

I've been really into penetration testing recently, and for fun, I've been working my way through all of the missions on [Hack This Site](https://www.hackthissite.org/). I thought it would be helpful to write up in-depth walkthroughs for each of the basic and realistic missions for those that are stuck and looking for an explanation, rather than just the solution.

In this walkthrough, we're going to go over the first realistic mission.

## Prerequisites

- Basic HTML

## Walkthrough

For this mission, our goal is to get the band Raging Inferno to the top of the list by somehow giving them a higher rating. From the front end, we can tell that voting is done by choosing a value, 1 through 5, from a dropdown and submitting that vote by simply pressing the vote button. Something to consider is that maybe the person who created this website hasn't done any sort of validation for the value being submitted in the dropdown. With that in mind, what can be done to submit a value that will push Raging Inferno to the top of the list?

{:.spoiler}
There's no validation to ensure that the values being submitted are 1 through 5. Therefore, the values in the select options can be changed to much higher numbers and then submitted, resulting in a much higher rating.