Welcome to the system documentation of UDN systems
# Apps
To make an app you need to make a function containing your code and also requires an argument called "ev".  
This is the event argument for when somebody clicks your app.
Next you need to register your app by calling registerApp which looks like this `App(name, icon, func)`  
Lets break that down  
So argument `name` would be the displayed name of the app on the desktop, argument `icon` is used to set the icon, you can check out all the icons if you go to the replit page and navigate to `content/appicons` just enter in the filename, and as last argument `func`. This argument requires the function (but not called).
## Example
```py
def test(ev):
Win("test", "it works!", 200, 200) registerApp(
 App(
  "test",
  "default.jpg",
  test
 )
)
```
# Windows
You probably saw the Win() function used in the previous example, that is used to make windows appear.  
This one will be ALOT shorter. So anyways the Win() function requires 4 arguments and returns itself (even though you never would use an already defined Window object)  
First argument is the title argument, i dont think i have the expplain what this does.  
The second argumet is the content argument, this is the inner html of your window.  
The third and fourth are width and height.
## Example
```py
Win("test", "IT WORKS >:D", 200, 200)
```
# Popups
Popups are basicly windows but width and height are hard coded and another argument has been added called "popupType", it is a string and has to be "Error" (for an error popup), "Info" (an information popup) or "Warning" (a warning popup).
It looks like this: `Popup(title, popupType, content)`
## Example
```py
Popup("SUS WARNING!", "Warning", "You are entering the sus zone!")
```
# The BOS (The basic output system)
NOTE: this might not be usefull for now because without modding there is no way of moddifying the boot code.
The basic output is a very simple way of outputting to the screen. The object used for outputting is *Screen*.
## screen.println
The printline function has 1 argument text, it just outputs the text as expected. No example needed.
## screen.clear
Just clears the screen, no example needed
## screen.changeColor
