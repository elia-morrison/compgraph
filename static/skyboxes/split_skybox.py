from PIL import Image
import sys, os

path = os.path.abspath("") + "/";
processed = False
    

def processImage(path, name):
    img = Image.open(os.path.join(path, name))
    print(img.size[0])
    size = img.size[0] / 4 # splits the width of the image by 3, expecting the 3x2 layout blender produces.
    splitAndSave(img, size*2, size, size, addToFilename(name, "_right")) #
    splitAndSave(img, size, 0, size, addToFilename(name, "_back")) #
    splitAndSave(img, 0, size, size, addToFilename(name, "_left")) #
    splitAndSave(img, size*3, size, size, addToFilename(name, "_down")) #
    splitAndSave(img, size, size, size, addToFilename(name, "_up")) #
    splitAndSave(img, size, size * 2, size, addToFilename(name, "_front"))

def addToFilename(name, add):
    name = name.split('.')
    return name[0] + add + "." + name[1]

def splitAndSave(img, startX, startY, size, name):
    area = (startX, startY, startX + size, startY + size)
    saveImage(img.crop(area), path, name)

def saveImage(img, path, name):
    try:
        img.save(os.path.join(path, name))
    except:
        print("*   ERROR: Could not convert image.")
        pass

if __name__ == "__main__":
    processImage("./", "night_skybox.png")