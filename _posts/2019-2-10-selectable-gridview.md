---
layout: post
title: Selectable GridView in Flutter
page-id: post
tags: [tutorial]
---

I've recently needed a more stylish and better functioning alternative to a dropdown list for my Flutter project and found that a GridView works perfectly for this. We can use the GridView to allow us to create a list of selectable items that we can then use wherever we need it. It's super simple to do and works flawlessly.

For this, we're going to be making a selectable GridView that allows us to select multiple icons. To make this easier and more organized, we'll create a widget for the GridView items:

<script src="https://gist.github.com/e8e7a270c927d0abe03eb8ebdfedcad5.js"></script>

Our GridViewItem widget is fairly straightforward. We have two private fields, `_iconData` and `_isSelected`. The widget itself is just a `RawMaterialButton` which allows us to easily set the shape of it to a circle and it's fill color depending on if it's selected or not. We have no use for the `onPressed` property, so we just set that to null.

Back to our main file, we need to create a couple of variables: one for the list of all the icons in our GridView, and another list for the selected icons.

<script src="https://gist.github.com/384f58e1ea3e30b7d3c80cd523e728c3.js"></script>

Within our build function, we can make a Widget variable for the GridView. I've gone ahead and added comments to explain what's going on.

<script src="https://gist.github.com/1b031bd28bf6e47a6748b59839c1490d.js"></script>

Lastly, still within our build function, we can set the body of our Scaffold to the `gridViewSelection` we created.

<script src="https://gist.github.com/73f7e5517c0c4ac3e47124aad739a179.js"></script>

That's all it takes to make a selectable GridView. If needed, it can be modified to allow for selecting a single item instead of multiple by changing up the `onTap` property of the GestureDetector.

<script src="https://gist.github.com/6ede76f7dedfc47af78a98d6843972ae.js"></script>

Instead of icons, you can use anything else you want: custom objects, strings, etc. I've found this to be a great, stylish, and functional alternative to other methods of item selection.

Here's the full code:

<script src="https://gist.github.com/6818e17a84b829feaa6d842a632a81ee.js"></script>

<script src="https://gist.github.com/1abb76dd693496906cc3cd3831601570.js"></script>