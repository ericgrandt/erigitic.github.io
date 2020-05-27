---
layout: post
title: Selectable GridView in Flutter
page-id: post
tags: [tutorial]
---

I've recently needed a more stylish and better functioning alternative to a dropdown list for my Flutter project and found that a GridView works perfectly for this. We can use the GridView to allow us to create a list of selectable items that we can then use wherever we need it. It's super simple to do and works flawlessly.

For this, we're going to be making a selectable GridView that allows us to select multiple icons. To make this easier and more organized, we'll create a widget for the GridView items:

```dart
import 'package:flutter/material.dart';

class GridViewItem extends StatelessWidget {
    final IconData _iconData;
    final bool _isSelected;

    GridViewItem(this._iconData, this._isSelected);

    @override
    Widget build(BuildContext context) {
        return RawMaterialButton(
            child: Icon(
                _iconData,
                color: Colors.white,
            ),
            shape: CircleBorder(),
            fillColor: _isSelected ? Colors.blue : Colors.black,
            onPressed: null,
        );
    }
}
```

Our GridViewItem widget is fairly straightforward. We have two private fields, `_iconData` and `_isSelected`. The widget itself is just a `RawMaterialButton` which allows us to easily set the shape of it to a circle and it's fill color depending on if it's selected or not. We have no use for the `onPressed` property, so we just set that to null.

Back to our main file, we need to create a couple of variables: one for the list of all the icons in our GridView, and another list for the selected icons.

```dart
final List<IconData> _icons = [
    Icons.offline_bolt,
    Icons.ac_unit,
    Icons.dashboard,
    Icons.backspace,
    Icons.cached,
    Icons.edit,
    Icons.face,
];

List<IconData> _selectedIcons = [];
```

Within our build function, we can make a Widget variable for the GridView. I've gone ahead and added comments to explain what's going on.

```dart
Widget gridViewSelection = GridView.count(
    childAspectRatio: 2.0, // Sets the aspect ratio of the GridView items
    crossAxisCount: 3, // The number of items per row
    mainAxisSpacing: 20.0, // Spacing between rows
    padding: EdgeInsets.symmetric(horizontal: 20.0, vertical: 20.0),
    children: _icons.map((iconData) { // Iterate through _icons as a map
        // For each icon in the _icons list, return a widget
        return GestureDetector(
            onTap: () {
                setState(() {
                    _selectedIcons.contains(iconData) ? _selectedIcons.remove(iconData) : _selectedIcons.add(iconData);
                });
            },
            child: GridViewItem(iconData, _selectedIcons.contains(iconData)), // Pass iconData and a boolean that specifies if the icon is selected or not
        );
    }).toList(), // Convert the map to a list of widgets
);
```

Lastly, still within our build function, we can set the body of our Scaffold to the `gridViewSelection` we created.

```dart
return Scaffold(
    appBar: AppBar(
        title: Text('Selectable GridView'),
    ),
    body: gridViewSelection,
);
```

That's all it takes to make a selectable GridView. If needed, it can be modified to allow for selecting a single item instead of multiple by changing up the `onTap` property of the GestureDetector.

```dart
onTap: () {
    _selectedIcons.clear();

    setState(() {
        _selectedIcons.add(iconData);
    });
},
```

Instead of icons, you can use anything else you want: custom objects, strings, etc. I've found this to be a great, stylish, and functional alternative to other methods of item selection.

Here's the full code:

`main.dart`
```dart
import 'package:flutter/material.dart';
import 'package:selectable_gridview/gridview_item.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
        return MaterialApp(
            title: 'Selectable GridView',
            theme: ThemeData(
                primarySwatch: Colors.blue,
            ),
            home: HomePage(),
        );
    }
}

class HomePage extends StatefulWidget {
    HomePage({Key key}) : super(key: key);

    @override
    _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
    final List<IconData> _icons = [
        Icons.offline_bolt,
        Icons.ac_unit,
        Icons.dashboard,
        Icons.backspace,
        Icons.cached,
        Icons.edit,
        Icons.face,
    ];

    List<IconData> _selectedIcons = [];

    @override
    Widget build(BuildContext context) {
        Widget gridViewSelection = GridView.count(
            childAspectRatio: 2.0,
            crossAxisCount: 3,
            mainAxisSpacing: 20.0,
            padding: EdgeInsets.symmetric(horizontal: 20.0, vertical: 20.0),
            children: _icons.map((iconData) {
                return GestureDetector(
                    onTap: () {
                        _selectedIcons.clear();

                        setState(() {
                            _selectedIcons.add(iconData);
                        });
                    },
                    child: GridViewItem(iconData, _selectedIcons.contains(iconData)),
                );
            }).toList(),
        );

        return Scaffold(
            appBar: AppBar(
                title: Text('Selectable GridView'),
            ),
            body: gridViewSelection,
        );
    }
}
```

`gridview_item.dart`
```dart
import 'package:flutter/material.dart';

class GridViewItem extends StatelessWidget {
    final IconData _iconData;
    final bool _isSelected;

    GridViewItem(this._iconData, this._isSelected);

    @override
    Widget build(BuildContext context) {
        return RawMaterialButton(
            child: Icon(
                _iconData,
                color: Colors.white,
            ),
            shape: CircleBorder(),
            fillColor: _isSelected ? Colors.blue : Colors.black,
            onPressed: null,
        );
    }
}
```