import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";
import { client } from "@/sanity/lib/client";

const Datafetch = async () => {
  // Sanity Query to fetch Products, Orders, and Users
  const query = await client.fetch(`
    {
      "products": *[_type == "product"]{
        _id,
        productName,
        slug,
        category,
        price,
        inventory,
        colors,
        status,
        image{
          asset -> {
            _id,
            url
          }
        },
        description,
      },
      "orders": *[_type == "order"]{
        _id,
        orderId,
        customer {
          firstName,
          lastName,
          email,
          address
        },
        items[]{
          name,
          quantity,
          price
        },
        totalAmount
      },
      "users": *[_type == "user"]{
        _id,
        email,
        firstName,
        lastName,
        dateOfBirth,
        country,
        gender,
        subscribe
      }
    }
  `);

  return (
    <div>
      {/* ✅ Products Data */}
      <h2>Products</h2>
      {query.products.map((product) => (
        <div key={product._id}>
          <h3>{product.productName}</h3>
          <p>Price: ${product.price}</p>
          <Image
            src={urlFor(product.image.asset.url).url()}
            alt={product.productName}
            width={100}
            height={100}
          />
        </div>
      ))}

      {/* ✅ Orders Data */}
      <h2>Orders</h2>
      {query.orders.map((order) => (
        <div key={order._id}>
          <h3>Order ID: {order.orderId}</h3>
          <p>Customer: {order.customer.firstName} {order.customer.lastName}</p>
          <p>Email: {order.customer.email}</p>
          <p>Address: {order.customer.address}</p>
          <p>Total Amount: ${order.totalAmount}</p>
          <h4>Items:</h4>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                {item.name} - Quantity: {item.quantity} - Price: ${item.price}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* ✅ Users Data */}
      <h2>Users</h2>
      {query.users.map((user) => (
        <div key={user._id}>
          <h3>{user.firstName} {user.lastName}</h3>
          <p>Email: {user.email}</p>
          <p>Country: {user.country}</p>
          <p>Gender: {user.gender}</p>
          <p>Subscribed: {user.subscribe ? "Yes" : "No"}</p>
        </div>
      ))}
    </div>
  );
};

export default Datafetch;
