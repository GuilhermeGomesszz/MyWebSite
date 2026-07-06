-- CreateIndex
CREATE INDEX "Appointment_barberId_scheduledAt_status_idx" ON "Appointment"("barberId", "scheduledAt", "status");

-- CreateIndex
CREATE INDEX "Appointment_barberId_scheduledAt_idx" ON "Appointment"("barberId", "scheduledAt");

-- CreateIndex
CREATE INDEX "Appointment_clientId_scheduledAt_idx" ON "Appointment"("clientId", "scheduledAt");

-- CreateIndex
CREATE INDEX "Appointment_scheduledAt_status_idx" ON "Appointment"("scheduledAt", "status");

-- CreateIndex
CREATE INDEX "Appointment_scheduledAt_idx" ON "Appointment"("scheduledAt");

-- CreateIndex
CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");

-- CreateIndex
CREATE INDEX "Appointment_serviceId_idx" ON "Appointment"("serviceId");

-- CreateIndex
CREATE INDEX "Appointment_barberId_status_idx" ON "Appointment"("barberId", "status");

-- CreateIndex
CREATE INDEX "Appointment_clientId_status_idx" ON "Appointment"("clientId", "status");

-- CreateIndex
CREATE INDEX "Appointment_scheduledAt_status_barberId_idx" ON "Appointment"("scheduledAt", "status", "barberId");

-- CreateIndex
CREATE INDEX "Cart_userId_idx" ON "Cart"("userId");

-- CreateIndex
CREATE INDEX "Cart_createdAt_idx" ON "Cart"("createdAt");

-- CreateIndex
CREATE INDEX "CartItem_cartId_idx" ON "CartItem"("cartId");

-- CreateIndex
CREATE INDEX "CartItem_serviceId_idx" ON "CartItem"("serviceId");

-- CreateIndex
CREATE INDEX "CartItem_cartId_serviceId_idx" ON "CartItem"("cartId", "serviceId");

-- CreateIndex
CREATE INDEX "CartItem_createdAt_idx" ON "CartItem"("createdAt");

-- CreateIndex
CREATE INDEX "Service_name_idx" ON "Service"("name");

-- CreateIndex
CREATE INDEX "Service_priceInCents_idx" ON "Service"("priceInCents");

-- CreateIndex
CREATE INDEX "Service_durationMinutes_idx" ON "Service"("durationMinutes");

-- CreateIndex
CREATE INDEX "Service_name_priceInCents_idx" ON "Service"("name", "priceInCents");

-- CreateIndex
CREATE INDEX "Service_createdAt_idx" ON "Service"("createdAt");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_name_idx" ON "User"("role", "name");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");
