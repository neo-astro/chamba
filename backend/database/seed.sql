-- Seed data for ProConnect
-- First, insert test users
INSERT INTO users (email, password_hash, full_name, bio) VALUES
('juan@example.com', '$2a$10$YourHashedPasswordHere1', 'Juan García', 'Electricista con 10 años de experiencia'),
('maria@example.com', '$2a$10$YourHashedPasswordHere2', 'María López', 'Diseñadora gráfica creativa'),
('carlos@example.com', '$2a$10$YourHashedPasswordHere3', 'Carlos Rodríguez', 'Plomero profesional'),
('elena@example.com', '$2a$10$YourHashedPasswordHere4', 'Elena Martínez', 'Desarrolladora web full-stack'),
('sergio@example.com', '$2a$10$YourHashedPasswordHere5', 'Sergio Fernández', 'Fotógrafo profesional'),
('ana@example.com', '$2a$10$YourHashedPasswordHere6', 'Ana Sánchez', 'Consultora de marketing digital');

-- Insert professionals (linked to users)
INSERT INTO professionals (user_id, category, price, price_unit, location, description, verified, featured, tags)
SELECT id, 'Electricista', 50, 'hora', 'Madrid', 'Electricista certificado con todas las licencias', true, true, '{"reparaciones","instalaciones","urgencias"}'
FROM users WHERE email = 'juan@example.com'
UNION ALL
SELECT id, 'Diseño Gráfico', 45, 'hora', 'Barcelona', 'Diseño creativo para tu marca', true, false, '{"logos","branding","redes sociales"}'
FROM users WHERE email = 'maria@example.com'
UNION ALL
SELECT id, 'Plomería', 55, 'hora', 'Valencia', 'Plomería de emergencia 24/7', true, true, '{"tuberías","desagües","calefacción"}'
FROM users WHERE email = 'carlos@example.com'
UNION ALL
SELECT id, 'Desarrollo Web', 80, 'hora', 'Madrid', 'Aplicaciones web modernas y escalables', true, false, '{"react","nextjs","postgresql"}'
FROM users WHERE email = 'elena@example.com'
UNION ALL
SELECT id, 'Fotografía', 150, 'sesión', 'Barcelona', 'Fotografía profesional para eventos', true, true, '{"bodas","eventos","retratos"}'
FROM users WHERE email = 'sergio@example.com'
UNION ALL
SELECT id, 'Marketing Digital', 60, 'hora', 'Madrid', 'Estrategias de marketing efectivas', false, false, '{"SEO","social media","analytics"}'
FROM users WHERE email = 'ana@example.com';
