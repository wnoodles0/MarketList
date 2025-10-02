document.addEventListener("DOMContentLoaded", () => {
    const newItemInput = document.getElementById("newItemInput");
    const addItemBtn = document.getElementById("addItemBtn");
    const shoppingList = document.getElementById("shoppingList");
    const resetBtn = document.getElementById("resetBtn");
    const copyBtn = document.getElementById("copyBtn");
    const bagHiwOptionsDiv = document.getElementById("bagHiwOptions");
    const bagHotOptionsDiv = document.getElementById("bagHotOptions");
    const toast = document.getElementById("toast");
    const editModal = document.getElementById("editModal");
    const editItemInput = document.getElementById("editItemInput");
    const saveEditBtn = document.getElementById("saveEditBtn");
    const cancelEditBtn = document.getElementById("cancelEditBtn");

    let items = JSON.parse(localStorage.getItem("marketListItems")) || [];
    let selectedBags = JSON.parse(localStorage.getItem("marketListSelectedBags")) || [];
    let editingIndex = null;

    const initialItems = [
        "ไก่สด", "เล็บมือนาง", "ตีนไก่", "ปลาดุก", "กุ้งสด", "หมึกสด", "ปูม้า", "ปูดำ", "หอยเชอรี่",
        "สีผสมอาหาร", "ถั่วลิสง", "กุ้งแห้ง", "กระเทียมเล็ก", "กระเทียมใหญ่",
        "กล่องใส่ไก่", "น้ำมะนาว", "น้ำกระเทียมดอง", "น้ำมันหอย", "น้ำมันพืช", "ซอสพริก",
        "ซอสฝาเขียว", "เกลือ", "พริกไทยดำ", "หอยดอง", "กะปิแท้", "น้ำตามะพร้าว", "น้ำตาลปี๊บ",
        "พริกแห้ง", "หอมแขก", "ไม้เสียบปลาดุก", "ถ้วยโฟม", "ช้อนส้อมพลาสติก", "เส้นเล็ก",
        "หมูทำต้ม", "หมูสับ", "คอแท้หมู", "เนื้อทำต้ม", "เนื้อทำก้อย", "ดีวัว", "หมูยอ",
        "ไข่เค็ม", "ขนมจีน", "พริกสด", "ผักกะหล่ำ", "มะเขือเปราะ", "ถั่วฝักยาว", "แตงกวา",
        "หน่อไม้ใส่ตำป่า", "ข่า", "ตะไคร้", "ใบมะกรูด", "ต้นหอม", "ผักชี", "ผักชีใบเลื่อย",
        "ผักชีลาว", "โหระพา", "ข้าวโพด", "มะละกอ", "มะนาว", "มะเขือเทศ", "มะม่วง", "ผักบุ้ง",
        "ใบเตย", "น้ำตาลทราย", "น้ำปลา", "ผงชูรส", "รสดี", "คนอร์"
    ];

    // Add initial items if the list is empty
    if (items.length === 0) {
        items = initialItems.map(item => ({ name: item, checked: false, isBag: false }));
        saveItems();
    }

    function saveItems() {
        localStorage.setItem("marketListItems", JSON.stringify(items));
        renderItems();
    }

    function saveSelectedBags() {
        localStorage.setItem("marketListSelectedBags", JSON.stringify(selectedBags));
    }

    function renderItems() {
        shoppingList.innerHTML = "";
        items.forEach((item, index) => {
            const li = document.createElement("li");
            li.className = item.checked ? "checked" : "";
            li.innerHTML = `
                <input type="checkbox" id="item-${index}" ${item.checked ? "checked" : ""}>
                <label for="item-${index}">${item.name}</label>
                <div class="item-actions">
                    <button class="edit-btn" data-index="${index}">แก้ไข</button>
                    <button class="delete-btn" data-index="${index}">ลบ</button>
                </div>
            `;
            shoppingList.appendChild(li);
        });
    }

    function addItem(name, isBag = false) {
        if (name.trim() !== "") {
            items.push({ name: name.trim(), checked: false, isBag: isBag });
            saveItems();
            newItemInput.value = "";
        }
    }

    function removeItemByName(name) {
        const index = items.findIndex(item => item.name === name && item.isBag);
        if (index !== -1) {
            items.splice(index, 1);
            saveItems();
        }
    }

    function openEditModal(index) {
        editingIndex = index;
        editItemInput.value = items[index].name;
        editModal.classList.add("show");
        editItemInput.focus();
    }

    function closeEditModal() {
        editModal.classList.remove("show");
        editingIndex = null;
        editItemInput.value = "";
    }

    function saveEdit() {
        if (editingIndex !== null && editItemInput.value.trim() !== "") {
            items[editingIndex].name = editItemInput.value.trim();
            saveItems();
            closeEditModal();
        }
    }

    addItemBtn.addEventListener("click", () => addItem(newItemInput.value));
    newItemInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            addItem(newItemInput.value);
        }
    });

    shoppingList.addEventListener("change", (e) => {
        if (e.target.type === "checkbox") {
            const index = e.target.id.split("-")[1];
            items[index].checked = e.target.checked;
            saveItems();
        }
    });

    shoppingList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const index = e.target.dataset.index;
            if (confirm("คุณต้องการลบรายการนี้หรือไม่?")) {
                // If it's a bag item, also uncheck the bag option
                if (items[index].isBag) {
                    const bagName = items[index].name;
                    selectedBags = selectedBags.filter(bag => bag !== bagName);
                    saveSelectedBags();
                    // Update checkbox state
                    const checkbox = document.querySelector(`input[value="${bagName}"]`);
                    if (checkbox) {
                        checkbox.checked = false;
                    }
                }
                items.splice(index, 1);
                saveItems();
            }
        } else if (e.target.classList.contains("edit-btn")) {
            const index = e.target.dataset.index;
            openEditModal(index);
        }
    });

    resetBtn.addEventListener("click", () => {
        if (confirm("คุณต้องการรีเซ็ตสถานะการเช็คทั้งหมดหรือไม่?")) {
            items = items.map(item => ({ ...item, checked: false }));
            saveItems();
        }
    });

    copyBtn.addEventListener("click", async () => {
        const checkedItems = items.filter(item => item.checked).map(item => item.name).join("\n");
        if (checkedItems) {
            try {
                // Try Web Share API first (for mobile)
                if (navigator.share) {
                    await navigator.share({
                        title: "รายการซื้อของ",
                        text: checkedItems
                    });
                    showToast("แชร์รายการเรียบร้อยแล้ว");
                } else {
                    // Fallback to clipboard
                    await navigator.clipboard.writeText(checkedItems);
                    showToast("คัดลอกไปยังคลิปบอร์ดแล้ว");
                }
            } catch (err) {
                console.error("Failed to copy or share: ", err);
                // Fallback method for older browsers
                const textArea = document.createElement("textarea");
                textArea.value = checkedItems;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand("copy");
                    showToast("คัดลอกไปยังคลิปบอร์ดแล้ว");
                } catch (e) {
                    alert("ไม่สามารถคัดลอกได้: " + e);
                }
                document.body.removeChild(textArea);
            }
        } else {
            alert("ไม่มีรายการที่ถูกเลือก");
        }
    });

    saveEditBtn.addEventListener("click", saveEdit);
    cancelEditBtn.addEventListener("click", closeEditModal);
    
    editItemInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            saveEdit();
        }
    });

    // Close modal when clicking outside
    editModal.addEventListener("click", (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });

    function showToast(message) {
        toast.textContent = message;
        toast.className = "show";
        setTimeout(() => { 
            toast.className = toast.className.replace("show", ""); 
        }, 3000);
    }

    // Bag options - ถุงหิ้ว
    const bagHiwSizes = [
        "ถุงหิ้ว 7*15",
        "ถุงหิ้ว 8*16",
        "ถุงหิ้ว 12*20"
    ];

    // Bag options - ถุงร้อน
    const bagHotSizes = [
        "ถุงร้อน 3*5",
        "ถุงร้อน 4/5*7",
        "ถุงร้อน 6*11",
        "ถุงร้อน 14*12"
    ];

    function createBagOption(bagName, container) {
        const option = document.createElement("div");
        option.className = "bag-option";
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `bag-${bagName.replace(/[*\/\s]/g, "-")}`;
        checkbox.value = bagName;
        
        // Check if this bag is already in the list
        const isInList = items.some(item => item.name === bagName && item.isBag);
        if (isInList) {
            checkbox.checked = true;
            if (!selectedBags.includes(bagName)) {
                selectedBags.push(bagName);
            }
        }
        
        checkbox.addEventListener("change", (e) => {
            if (e.target.checked) {
                addItem(bagName, true);
                selectedBags.push(bagName);
                saveSelectedBags();
                showToast(`เพิ่ม "${bagName}" แล้ว`);
            } else {
                removeItemByName(bagName);
                selectedBags = selectedBags.filter(bag => bag !== bagName);
                saveSelectedBags();
                showToast(`ลบ "${bagName}" แล้ว`);
            }
        });
        
        const card = document.createElement("label");
        card.className = "bag-card";
        card.htmlFor = checkbox.id;
        card.textContent = bagName.replace("ถุงหิ้ว ", "").replace("ถุงร้อน ", "");
        
        option.appendChild(checkbox);
        option.appendChild(card);
        container.appendChild(option);
    }

    bagHiwSizes.forEach(bag => createBagOption(bag, bagHiwOptionsDiv));
    bagHotSizes.forEach(bag => createBagOption(bag, bagHotOptionsDiv));

    renderItems();
});
