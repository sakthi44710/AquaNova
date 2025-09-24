import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const StreamlinesLayer = ({ currentData, opacity = 0.7 }) => {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    if (!currentData || currentData.length === 0) return;

    // Remove existing layer
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    // Create custom canvas layer for streamlines
    const StreamlinesCanvasLayer = L.Layer.extend({
      onAdd: function(map) {
        this._map = map;
        
        // Create canvas element
        this._canvas = L.DomUtil.create('canvas', 'streamlines-canvas');
        this._canvas.style.position = 'absolute';
        this._canvas.style.top = '0';
        this._canvas.style.left = '0';
        this._canvas.style.pointerEvents = 'none';
        this._canvas.style.opacity = opacity;
        
        // Add to map pane
        map.getPanes().overlayPane.appendChild(this._canvas);
        
        // Set canvas size
        this._updateCanvasSize();
        
        // Draw streamlines
        this._drawStreamlines();
        
        // Update on map events
        map.on('viewreset', this._reset, this);
        map.on('zoom', this._reset, this);
        map.on('move', this._reset, this);
      },
      
      onRemove: function(map) {
        if (this._canvas) {
          map.getPanes().overlayPane.removeChild(this._canvas);
        }
        map.off('viewreset', this._reset, this);
        map.off('zoom', this._reset, this);
        map.off('move', this._reset, this);
      },
      
      _updateCanvasSize: function() {
        const size = this._map.getSize();
        this._canvas.width = size.x;
        this._canvas.height = size.y;
        
        const bounds = this._map.getBounds();
        const topLeft = this._map.latLngToContainerPoint(bounds.getNorthWest());
        
        L.DomUtil.setPosition(this._canvas, topLeft);
      },
      
      _reset: function() {
        this._updateCanvasSize();
        this._drawStreamlines();
      },
      
      _drawStreamlines: function() {
        const ctx = this._canvas.getContext('2d');
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        
        // Create grid for streamlines
        const gridSize = 20; // pixels between grid points
        
        for (let x = 0; x < this._canvas.width; x += gridSize) {
          for (let y = 0; y < this._canvas.height; y += gridSize) {
            const latLng = this._map.containerPointToLatLng([x, y]);
            
            // Find nearest current data point
            const nearestCurrent = this._findNearestCurrent(latLng.lat, latLng.lng);
            
            if (nearestCurrent && nearestCurrent.speed > 0.01) {
              this._drawStreamline(ctx, x, y, nearestCurrent);
            }
          }
        }
      },
      
      _findNearestCurrent: function(lat, lng) {
        let nearest = null;
        let minDistance = Infinity;
        
        currentData.forEach(current => {
          const distance = Math.sqrt(
            Math.pow(current.lat - lat, 2) + Math.pow(current.lon - lng, 2)
          );
          
          if (distance < minDistance) {
            minDistance = distance;
            nearest = current;
          }
        });
        
        // Only return if reasonably close (within ~1 degree)
        return minDistance < 1.0 ? nearest : null;
      },
      
      _drawStreamline: function(ctx, startX, startY, current) {
        const segments = 8; // number of segments in streamline
        const segmentLength = 12; // pixels per segment
        
        let x = startX;
        let y = startY;
        
        // Calculate streamline path
        const path = [[x, y]];
        
        for (let i = 0; i < segments; i++) {
          // Convert current direction to canvas coordinates
          const angle = (current.direction - 90) * Math.PI / 180; // Convert to radians, adjust for canvas coords
          
          x += Math.cos(angle) * segmentLength * Math.min(current.speed * 10, 2);
          y += Math.sin(angle) * segmentLength * Math.min(current.speed * 10, 2);
          
          path.push([x, y]);
        }
        
        // Draw streamline with gradient effect
        const gradient = ctx.createLinearGradient(path[0][0], path[0][1], path[path.length-1][0], path[path.length-1][1]);
        
        // Color based on speed - green to yellow like in the image
        const startColor = this._getSpeedColor(current.speed, 0.8);
        const endColor = this._getSpeedColor(current.speed, 0.3);
        
        gradient.addColorStop(0, startColor);
        gradient.addColorStop(1, endColor);
        
        // Draw streamline
        ctx.beginPath();
        ctx.moveTo(path[0][0], path[0][1]);
        
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i][0], path[i][1]);
        }
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.max(1, current.speed * 3);
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Add arrowhead at the end
        this._drawArrowhead(ctx, path[path.length-2], path[path.length-1], current.speed);
      },
      
      _drawArrowhead: function(ctx, penultimate, end, speed) {
        const headLength = Math.max(6, speed * 8);
        const angle = Math.atan2(end[1] - penultimate[1], end[0] - penultimate[0]);
        
        ctx.beginPath();
        ctx.moveTo(end[0], end[1]);
        ctx.lineTo(
          end[0] - headLength * Math.cos(angle - Math.PI / 6),
          end[1] - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(end[0], end[1]);
        ctx.lineTo(
          end[0] - headLength * Math.cos(angle + Math.PI / 6),
          end[1] - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.strokeStyle = this._getSpeedColor(speed, 0.9);
        ctx.lineWidth = 2;
        ctx.stroke();
      },
      
      _getSpeedColor: function(speed, alpha = 1) {
        // Create green to yellow gradient based on speed like in the uploaded image
        const normalizedSpeed = Math.min(speed / 1.0, 1);
        
        if (normalizedSpeed < 0.3) {
          // Light green for slow currents
          return `rgba(144, 238, 144, ${alpha})`;
        } else if (normalizedSpeed < 0.6) {
          // Medium green
          return `rgba(50, 205, 50, ${alpha})`;
        } else if (normalizedSpeed < 0.8) {
          // Yellow-green
          return `rgba(154, 205, 50, ${alpha})`;
        } else {
          // Yellow for fast currents
          return `rgba(255, 255, 0, ${alpha})`;
        }
      }
    });

    // Create and add the custom layer
    layerRef.current = new StreamlinesCanvasLayer();
    map.addLayer(layerRef.current);

    // Cleanup function
    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [map, currentData, opacity]);

  return null; // This component doesn't render anything directly
};

export default StreamlinesLayer;