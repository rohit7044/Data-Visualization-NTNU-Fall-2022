import numpy as np
import matplotlib.pyplot as plt
import json

data = 0

# after loading the transfer function,
# each subarray (control point) in an opacity function: [dataValue, opacity]
# each subarray (control point) in a color function: [dataValue, R(0-1), G(0-1), B(0-1)]
opacityTransferFunc = []
colorTransferFunc = []


##### data loading and setup/plot image
##### DO NOT modify this function
def Initialize(tfFileName):
    global data
    plt.rcParams['figure.figsize'] = [5, 5]
    plt.axis('off')
    data = np.load('data.npy')

    f = open(tfFileName)
    jsn = json.load(f)
    jsn = jsn[0]

    opacityTransferFunc.clear()
    colorTransferFunc.clear()
    for i in range(0, len(jsn['Points']), 4):
        tmp = []
        tmp.append(jsn['Points'][i + 0])
        tmp.append(jsn['Points'][i + 1])
        opacityTransferFunc.append(tmp)
    for i in range(0, len(jsn['RGBPoints']), 4):
        tmp = []
        tmp.append(jsn['RGBPoints'][i + 0])
        tmp.append(jsn['RGBPoints'][i + 1])
        tmp.append(jsn['RGBPoints'][i + 2])
        tmp.append(jsn['RGBPoints'][i + 3])
        colorTransferFunc.append(tmp)


###### get data value: x and y are locaion on the image plane, z is coordinate along the pixel depth direction
###### In this data, x index: [0, 125), y index: [0, 125), z index: [0, 49)
def getValue(x, y, z):
    global data
    return data[z, x, y]


###########main

### initialize and load a transfer function, the input argument is the trasnfer function file name
### after loading the opacity function and color function are stored in 'opacityTransferFunc' and 'colorTransferFunc'
Initialize('TF1.json')


##### 'img' is used to store the final image
img = np.zeros([125, 125, 3])

####### implment you direct volume rendering here and store the final image in "img"
#Author - Rohit Das
#61047086s
#61047086s@ntnu.edu.tw

# Get the value
def getrange(temp, temp_arr):
    # Get Interval
    index = np.searchsorted(temp_arr, temp)
    if (index == 0):
        smallest = temp_arr[index]
        largest = temp_arr[index - 1]
        small_index = index
        large_index = index - 1
    else:
        smallest = temp_arr[index - 1]
        largest = temp_arr[index]
        small_index = index - 1
        large_index = index
    return smallest, largest, small_index, large_index


def getOpacityValue(smallest, largest, datapoint, small_index, large_index):
    # Linear Interpolation
    # p = (v1-vc)/(v1/v2)*(p2-p1)+p1
    v1 = smallest
    v2 = largest
    p1 = opacityTransferFunc[small_index][1]
    p2 = opacityTransferFunc[large_index][1]
    opacityValue = np.interp(datapoint, [v1, v2], [p1, p2])
    return opacityValue


def getColorValue(smallest, largest, datapoint, small_index, large_index):
    # Linear Interpolation
    # p = (v1-vc)/(v1/v2)*(p2-p1)+p1
    v1 = smallest
    v2 = largest
    r1 = colorTransferFunc[small_index][1]
    r2 = colorTransferFunc[large_index][1]
    g1 = colorTransferFunc[small_index][2]
    g2 = colorTransferFunc[large_index][2]
    b1 = colorTransferFunc[small_index][3]
    b2 = colorTransferFunc[large_index][3]
    rValue = np.interp(datapoint, [v1, v2], [r1, r2])
    gValue = np.interp(datapoint, [v1, v2], [g1, g2])
    bValue = np.interp(datapoint, [v1, v2], [b1, b2])
    return rValue, gValue, bValue


def F2B_Compositing(R, G, B, newOpacity):
    global sumOpacity, sumR, sumG, sumB
    if (sumOpacity >= 1.0):
        return True

    else:
        newR = (R * newOpacity) * (1 - sumOpacity)
        newG = (G * newOpacity) * (1 - sumOpacity)
        newB = (B * newOpacity) * (1 - sumOpacity)
        tempOpacity = newOpacity * (1 - sumOpacity)
        sumOpacity += tempOpacity
        sumR += newR
        sumG += newG
        sumB += newB
        return False


# convert the opacity data value to array for using np.searchsorted function
opacity_arr = []
for d_value, opacity in opacityTransferFunc:
    opacity_arr.append(d_value)
opacity_arr = np.array(opacity_arr)
# convert the color data value to array for using np.searchsorted function
color_arr = []
for d_value, R, G, B in colorTransferFunc:
    color_arr.append(d_value)
color_arr = np.array(color_arr)

for y in range(0, 125):
    for x in range(0, 125):
        sumOpacity = 0
        sumR = 0
        sumG = 0
        sumB = 0
        for z in range(0, 45):
            npyValue = getValue(x, y, z)
            # Get opacity Point Value
            op_smallest, op_largest, op_small_index, op_large_index = getrange(npyValue, opacity_arr)
            newOpacity = getOpacityValue(op_smallest, op_largest, npyValue, op_small_index, op_large_index)
            # Get Color Point Value
            cp_smallest, cp_largest, cp_small_index, cp_large_index = getrange(npyValue, color_arr)
            R, G, B = getColorValue(cp_smallest, cp_largest, npyValue, cp_small_index, cp_large_index)
            # Front to Back Compositing
            endloop = F2B_Compositing(R, G, B, newOpacity)
            if (endloop == True):
                break
        img[x, y] = [sumR, sumG, sumB]

####### show final image (img)
plt.imshow(img)
plt.show()