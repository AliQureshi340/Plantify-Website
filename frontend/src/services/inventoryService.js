// inventoryService.js - Inventory and stock management
export class InventoryService {
  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL || 'https://api.plantify.pk';
  }

  // Update stock levels
  async updateStock(productId, quantity, type = 'set') {
    try {
      const response = await fetch(`${this.apiUrl}/inventory/${productId}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          quantity, 
          type, // 'set', 'add', 'subtract'
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Stock update failed');
      
      const result = await response.json();
      
      // Check for low stock alerts
      if (result.stock <= result.lowStockThreshold) {
        await this.sendLowStockAlert(result);
      }
      
      return { success: true, result };
    } catch (error) {
      console.error('Stock update failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Reserve stock for pending orders
  async reserveStock(items) {
    try {
      const response = await fetch(`${this.apiUrl}/inventory/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items,
          reservedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 min expiry
        })
      });

      if (!response.ok) throw new Error('Stock reservation failed');
      
      const reservation = await response.json();
      return { success: true, reservation };
    } catch (error) {
      console.error('Stock reservation failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Release reserved stock
  async releaseReservation(reservationId) {
    try {
      const response = await fetch(`${this.apiUrl}/inventory/reserve/${reservationId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Reservation release failed');
      
      return { success: true };
    } catch (error) {
      console.error('Reservation release failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Check stock availability
  async checkAvailability(items) {
    try {
      const response = await fetch(`${this.apiUrl}/inventory/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });

      if (!response.ok) throw new Error('Availability check failed');
      
      const availability = await response.json();
      return { success: true, availability };
    } catch (error) {
      console.error('Availability check failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Get low stock items
  async getLowStockItems() {
    try {
      const response = await fetch(`${this.apiUrl}/inventory/low-stock`);
      if (!response.ok) throw new Error('Failed to fetch low stock items');
      
      const items = await response.json();
      return { success: true, items };
    } catch (error) {
      console.error('Failed to fetch low stock items:', error);
      return { success: false, error: error.message };
    }
  }

  // Set low stock threshold
  async setLowStockThreshold(productId, threshold) {
    try {
      const response = await fetch(`${this.apiUrl}/inventory/${productId}/threshold`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threshold })
      });

      if (!response.ok) throw new Error('Threshold update failed');
      
      return { success: true };
    } catch (error) {
      console.error('Threshold update failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Add new product
  async addProduct(productData) {
    try {
      const response = await fetch(`${this.apiUrl}/inventory/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Product creation failed');
      
      const product = await response.json();
      return { success: true, product };
    } catch (error) {
      console.error('Product creation failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Update product
  async updateProduct(productId, updates) {
    try {
      const response = await fetch(`${this.apiUrl}/inventory/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updates,
          updatedAt: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Product update failed');
      
      const product = await response.json();
      return { success: true, product };
    } catch (error) {
      console.error('Product update failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete product
  async deleteProduct(productId) {
    try {
      const response = await fetch(`${this.apiUrl}/inventory/products/${productId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Product deletion failed');
      
      return { success: true };
    } catch (error) {
      console.error('Product deletion failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate stock report
  async generateStockReport(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${this.apiUrl}/inventory/reports/stock?${params}`);
      
      if (!response.ok) throw new Error('Report generation failed');
      
      const report = await response.json();
      return { success: true, report };
    } catch (error) {
      console.error('Report generation failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Track stock movements
  async getStockMovements(productId, startDate, endDate) {
    try {
      const params = new URLSearchParams({
        start: startDate,
        end: endDate
      });
      
      const response = await fetch(`${this.apiUrl}/inventory/${productId}/movements?${params}`);
      if (!response.ok) throw new Error('Failed to fetch movements');
      
      const movements = await response.json();
      return { success: true, movements };
    } catch (error) {
      console.error('Failed to fetch movements:', error);
      return { success: false, error: error.message };
    }
  }

  // Send low stock alert
  async sendLowStockAlert(product) {
    try {
      await fetch(`${this.apiUrl}/notifications/low-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product,
          message: `Low Stock Alert: ${product.name} has only ${product.stock} units remaining.`,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to send low stock alert:', error);
    }
  }

  // Bulk stock update
  async bulkStockUpdate(updates) {
    try {
      const response = await fetch(`${this.apiUrl}/inventory/bulk-update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });

      if (!response.ok) throw new Error('Bulk update failed');
      
      const result = await response.json();
      return { success: true, result };
    } catch (error) {
      console.error('Bulk update failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Import products from CSV
  async importProducts(csvData) {
    try {
      const response = await fetch(`${this.apiUrl}/inventory/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvData })
      });

      if (!response.ok) throw new Error('Import failed');
      
      const result = await response.json();
      return { success: true, result };
    } catch (error) {
      console.error('Import failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Export products to CSV
  async exportProducts(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${this.apiUrl}/inventory/export?${params}`);
      
      if (!response.ok) throw new Error('Export failed');
      
      const csv = await response.blob();
      return { success: true, csv };
    } catch (error) {
      console.error('Export failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export const inventoryService = new InventoryService();