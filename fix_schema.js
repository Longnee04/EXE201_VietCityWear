const fs = require('fs');
let content = fs.readFileSync('prisma/schema.prisma', 'utf-8');
content = content.replace(/@@map\("(.*?)"\)/g, '@@map("$1")\n  @@schema("public")');
fs.writeFileSync('prisma/schema.prisma', content);
