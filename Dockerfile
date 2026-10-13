# ==============================================================================
# Dockerfile for TaskMaster Todo Web App (Tomcat 9 + Java Servlets)
# Deploys directly into Tomcat's ROOT context
# ==============================================================================

FROM tomcat:9.0-jdk11-openjdk-slim

# Remove all default sample web applications
RUN rm -rf /usr/local/tomcat/webapps/* /usr/local/tomcat/webapps.dist

# Create ROOT application directory
RUN mkdir -p /usr/local/tomcat/webapps/ROOT

# Set working directory to ROOT
WORKDIR /usr/local/tomcat/webapps/ROOT

# Copy frontend static files
COPY index.html style.css app.js ./

# Copy WEB-INF directory
COPY WEB-INF ./WEB-INF

# Copy Java source files and compile into WEB-INF/classes
COPY src ./src
RUN mkdir -p WEB-INF/classes && \
    javac -cp "/usr/local/tomcat/lib/servlet-api.jar" -d WEB-INF/classes $(find src -name "*.java") && \
    rm -rf src

# Ensure correct file permissions
RUN chmod -R 755 /usr/local/tomcat/webapps/ROOT

# Reset working directory to Tomcat home
WORKDIR /usr/local/tomcat

# Expose ports
EXPOSE 8080 10000

# Dynamically bind port to Render's $PORT and run Tomcat
CMD ["sh", "-c", "sed -i \"s/port=\\\"8080\\\"/port=\\\"${PORT:-8080}\\\"/g\" /usr/local/tomcat/conf/server.xml && exec /usr/local/tomcat/bin/catalina.sh run"]
