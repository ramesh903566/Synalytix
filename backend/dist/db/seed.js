"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
async function main() {
    console.log('Seeding database...');
    // Example minimal seed
    const org = await client_1.prisma.organization.upsert({
        where: { slug: 'demo-org' },
        update: {},
        create: {
            name: 'Demo Organization',
            slug: 'demo-org'
        }
    });
    const user = await client_1.prisma.user.upsert({
        where: { email: 'admin@demo.com' },
        update: {},
        create: {
            email: 'admin@demo.com',
            name: 'Admin User'
        }
    });
    await client_1.prisma.organizationMember.upsert({
        where: {
            organization_id_user_id: {
                organization_id: org.id,
                user_id: user.id
            }
        },
        update: {},
        create: {
            organization_id: org.id,
            user_id: user.id,
            role: 'owner'
        }
    });
    console.log('Database seeded successfully.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await client_1.prisma.$disconnect();
});
