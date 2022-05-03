import time

begin = time.time()

x = 0
for i in range(10):
    x = x + i

time.sleep(1)

end = time.time()

print(end-begin)