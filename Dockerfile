# ==============================================================================
# Dockerfile for TaskMaster Todo Web App (Tomcat 9 + Java Servlets)
# Deploys automatically on free cloud hosts (Render.com, Railway, etc.)
# ==============================================================================

FROM tomcat:9.0-jdk11-openjdk-slim

# Clear default Tomcat sample pages
RUN rm -rf /usr/local/tomcat/webapps/ROOT/*

# Set working directory to Tomcat's default ROOT web app
WORKDIR /usr/local/tomcat/webapps/ROOT

# Copy frontend assets (HTML, CSS, JS)
COPY index.html style.css app.js ./

# Copy WEB-INF configuration
COPY WEB-INF ./WEB-INF

# Copy Java source files and compile them into WEB-INF/classes
COPY src ./src
RUN mkdir -p WEB-INF/classes && \
    javac -cp "/usr/local/tomcat/lib/servlet-api.jar" -d WEB-INF/classes $(find src -name "*.java") && \
    rm -rf src

# Expose ports
EXPOSE 8080 10000

# Dynamically adapt Tomcat port to Render's $PORT environment variable and start
CMD ["sh", "-c", "sed -i \"s/port=\\\"8080\\\"/port=\\\"${PORT:-8080}\\\"/g\" /usr/local/tomcat/conf/server.xml && catalina.sh run"]
