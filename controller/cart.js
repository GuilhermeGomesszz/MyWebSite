import prisma from "../config/db.js";

export const addToCart = async (req, res) => {
    try {
        const { serviceId } = req.body;
        const userId = req.user.id;

        let cart = await prisma.cart.findFirst({
            where: { userId }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId }
            });
        }

        const item = await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                serviceId: Number(serviceId)
            }
        });

        return res.status(201).json(item);

    } catch (error) {
        return res.status(500).json({ message: "Erro ao adicionar ao carrinho" });
    }
};

export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await prisma.cart.findFirst({
            where: { userId },
            include: {
                items: {
                    include: {
                        service: true
                    }
                }
            }
        });

        return res.json(cart);

    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar carrinho" });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const updated = await prisma.cartItem.update({
            where: { id: Number(id) },
            data: { quantity: Number(quantity) }
        });

        return res.json(updated);

    } catch (error) {
        return res.status(500).json({ message: "Erro ao atualizar item" });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.cartItem.delete({
            where: { id: Number(id) }
        });

        return res.json({ message: "Item removido" });

    } catch (error) {
        return res.status(500).json({ message: "Erro ao remover item" });
    }
};