Sayın bordo.io yetkilisi bu klasörde database'den görüntüleri bulabilirsiniz.

Kodumda ve özellikle database'de bazı gereksiz ögeler bulunuyor. bunları başta başka bir gidişat yolu düşündüğüm için, sizin de görmeniz adına silmedim.
Başta clinic modelinde doctor[] ile doctor'ları tutmayı patient[] ile patient'ları tutmayı, doctor ve patient modellerinde ise Date[] ile tarihleri tutmayı böylece çakışmaları daha kolay önleyeceğimi düşünmüştüm ancak işler çok düşündüğüm gibi gitmedi ve bazı buglar aldım
Sonrasında mapping ile bu işi çözdüm. 

Bu yolları düşüğümde database'ye eklediğim ögeleri görmeniz için silmeyip yorum satırına alıdm. Yine kodlarda da eğer ona yönelik bir şey yazdıysam genelde yorum satırına aldım.

Database olarak PostgreSQL'li Aiven cloud server ile kullandım sizinle paylaşmam gerekirse database internette olduğu için kolayca paylaşabilirim.
Görevde kullanmam serbest miydi bilmiyorum ama prisma kullandım. 
Postman yerine swagger'ı tercih ettim. daha kullanışlı ve hızlı olduğunu düşünüyorum.

Bu klasörde database tablomdan ekran görüntülerini görebilirsiniz.

randevularda input olarak ISO Date Time format kullandım