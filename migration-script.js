const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateBillingCycles() {
  try {
    console.log('Starting billing cycle migration...');

    // First, let's see what billing cycles exist in the database
    const subscriptions = await prisma.subscription.findMany({
      select: {
        id: true,
        billingCycle: true,
      },
    });

    console.log('Current billing cycles in database:', subscriptions.map(s => s.billingCycle));

    // Update billing cycles to match the new enum values
    const updates = [];
    
    for (const subscription of subscriptions) {
      let newBillingCycle;
      
      switch (subscription.billingCycle) {
        case 'monthly':
          newBillingCycle = 'monthly';
          break;
        case 'yearly':
          newBillingCycle = 'yearly';
          break;
        case '2yr':
          newBillingCycle = 'twoYear';
          break;
        case '3yr':
          newBillingCycle = 'threeYear';
          break;
        default:
          // If it's already in the new format, keep it
          if (['monthly', 'yearly', 'twoYear', 'threeYear'].includes(subscription.billingCycle)) {
            newBillingCycle = subscription.billingCycle;
          } else {
            // Default to monthly for unknown values
            newBillingCycle = 'monthly';
          }
      }

      if (newBillingCycle !== subscription.billingCycle) {
        updates.push(
          prisma.subscription.update({
            where: { id: subscription.id },
            data: { billingCycle: newBillingCycle },
          })
        );
      }
    }

    if (updates.length > 0) {
      console.log(`Updating ${updates.length} subscriptions...`);
      await prisma.$transaction(updates);
      console.log('Migration completed successfully!');
    } else {
      console.log('No updates needed - all billing cycles are already in the correct format.');
    }

    // Verify the migration
    const updatedSubscriptions = await prisma.subscription.findMany({
      select: {
        id: true,
        billingCycle: true,
      },
    });

    console.log('Updated billing cycles:', updatedSubscriptions.map(s => s.billingCycle));

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateBillingCycles(); 