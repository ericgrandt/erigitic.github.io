---
layout: post
title: 'Google CTF: Beginners Quest - JS Safe'
page-id: post
tags: [write-up]
---

> Well it's definitely the 90s. Using what was found in the mysterious .ico file, you extract the driver for the Aluminum-Key Hardware password storage device. Let's see what it has in store.

For this CTF, we are given an HTML file that displays a text field. After taking a quick peek at the code, we can see that the text we put into this field goes through a client-side authentication process. As well as that, the hash algorithm being used is `SHA-256`. This must mean that whatever we input into the field gets hashed and then compared to the hash of the actual password. This also means that there must be a way to retrieve the actual password hash.

When the value in the keyhole input is changed, the `open_safe()` function is called. This is where we want to start our work.

The first line we care about in this function is

```javascript
password = /^CTF{([0-9a-zA-Z_@!?-]+)}$/.exec(keyhole.value);
```

This tells us that the password we put in must match this regex. In other words, the password must contain `CTF{}` and between the opening and closing curly braces we must have, at the very least, a digit, character, or symbol (_, @, !, ?, or -). If the password we input does not match that regex, it returns `null`.

This takes us to the next line

```javascript
if (!password || !(await x(password[1]))) return document.body.className = 'denied';
```

The first check makes sure our password isn't null, which it shouldn't be as long as the regex above is followed. The second check is the big one. It passes the value of our password, only the part between `{` and `}`, to a function `x` which can be found near the top of the file. The return value of `x` must equal true, otherwise, we'll be denied access.

In the `x` function we have a couple of variables, `code` and `env`. The `code` variable just looks like a bunch of random characters at first and is used within the for loop a few lines down. `env` is an object which has a bunch of different properties. The one that stands out the most is the `g` property since it's the only one using the password argument being passed in. The `g` property is encoding the password into it's ASCII decimal equivalent and storing it into an array.

Moving on down, we have a for loop that is looping through the `code` variable 4 characters at a time. The 4 characters are stored in the variables `lhs`, `fn`, `arg1`, and `arg2` respectively. Then we have a try-catch block that shows how those variables are being used, and an if statement that checks for a `Promise` and runs it. Finally, it returns `!env.h`. As stated earlier, this function must return true. Therefore, `env.h` must equal `false`, or `0`.

Let's make use of the `g` property in the `env` object, as this is the property that stores our password. To do this, we just want to make an if statement that will check if `arg1` or `arg2` is equal to `g`. If it is, we can print some stuff out within our for loop to see what's going on behind the scenes.

```javascript
if (arg1 == 'g' || arg2 == 'g') {
	console.log(i);
	console.log(lhs + ' = ' + fn + '(' + arg1 + ', ' + arg2 + ');');
	console.log(env[lhs], env[fn], env[arg1], env[arg2]);
}
```

If we input `CTF{1}` as the password, the console will display

```console
876
ѷ = ј(Ѳ, g);
undefined ƒ Array() { [native code] } "sha-256" Uint8Array [49]
```

It's creating another array with the string `sha-256` and a Uint8Array containing the decimal equivalent of our password.

Let's keep following these variables, this time swapping out `g` with `ѷ` in our if statement. This time we get

```console
880
Ѹ = ј(ѭ, ѷ);
undefined ƒ Array() { [native code] } SubtleCrypto {}__proto__: SubtleCrypto (2) ["sha-256", Uint8Array(1)]
```

We now have a `SubtleCrypto` object. Follow the new variable, `Ѹ`, to get

```console
884
ѹ = b(Ѱ, Ѹ);
undefined (x,y) => Function.constructor.apply.apply(x, y) ƒ digest() { [native code] } (2) [SubtleCrypto, Array(2)]
```

This time it's actually executing a function called `digest`. An array containing a `SubtleCrypto` object, and the array containing `sha-256` and our password in ASCII are passed as arguments to that digest function. Follow `ѹ` to get

```console
940
Ѿ = ѽ(ѹ, ш);
undefined ƒ Uint8Array() { [native code] } ArrayBuffer(32) {CONTENTS REMOVED TO SAVE SPACE} "x"
```

That digest function hashed our password and we can see that hashed password in the ArrayBuffer above. We're getting close at this point. Once again, let's follow the new variable we got, `Ѿ`.

The output we get from following `Ѿ` shows that each value of our hashed password is being retrieved one by one and is stored in `ѿ`. Let's follow `ѿ` now and we'll receive a bunch of results similar to

```console
964
Ҁ = ј(ѿ, T);
0 ƒ Array() { [native code] } 107 230
```

A single value of our hashed password, `ѿ`, is being passed to a function along with some other argument, in this case, `T`. Let's take it 2 more steps to see what is happening with these two arguments.

Following `Ҁ` shows we are XORing the two values and storing that result in `҂`. Following `҂` shows that the result of the XOR is being ORed with a value of our hashed password. From this, we know that the second argument, `T` in the snippet above, is a piece of the actual hashed password in decimal form. If we take all of those values, we end up with the hashed password in decimal form:

`230 104 96 84 111 24 205 187 205 134 179 94 24 181 37 191 252 103 247 114 198 80 206 223 227 255 122 0 38 250 29 238`

Convert that to hex and you get

`e66860546f18cdbbcd86b35e18b525bffc67f772c650cedfe3ff7a0026fa1dee`

This is the actual hashed password. Now we can use a rainbow table to see if a plain text version of this hash is known. And it is known:

`Passw0rd!`

Therefore, the flag is `CTF{Passw0rd!}`.