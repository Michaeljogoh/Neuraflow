import { polarClient } from "./polar";

type PolarCustomerState = Awaited<
  ReturnType<typeof polarClient.customers.getStateExternal>
>;

async function hasPaidProOrder(customerId: string): Promise<boolean> {
  const proProductId = process.env.POLAR_PRO_PRODUCT_ID;

  if (!proProductId) {
    return false;
  }

  const { result } = await polarClient.orders.list({
    customerId,
    limit: 50,
  });

  const orders = result?.items ?? [];

  return orders.some(
    (order) =>
      order.paid === true &&
      order.status === "paid" &&
      order.productId === proProductId,
  );
}

export async function getPremiumAccess(externalId: string): Promise<{
  customer: PolarCustomerState;
  hasAccess: boolean;
}> {
  const customer = await polarClient.customers.getStateExternal({
    externalId,
  });

  const hasActiveSubscription =
    (customer.activeSubscriptions?.length ?? 0) > 0;
  const hasGrantedBenefits = (customer.grantedBenefits?.length ?? 0) > 0;

  if (hasActiveSubscription || hasGrantedBenefits) {
    return { customer, hasAccess: true };
  }

  const hasProPurchase = await hasPaidProOrder(customer.id);

  return {
    customer,
    hasAccess: hasProPurchase,
  };
}
